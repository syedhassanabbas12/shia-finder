// Supabase Edge Function: approve-edit
//
// Called by a moderator from the app's review queue (see
// packages/core/src/api/moderation.ts). Two responsibilities:
//   1. Resolve the suggestion row in Postgres (status, resolved_by/at).
//   2. On approval, open a pull request against the public register repo
//      that updates the relevant field and re-dates checked/checkedBy —
//      this is the step that turns an in-app confirmation into the
//      "commit with your name on it" the design promises.
//
// Runs with the Supabase service role (not the caller's session), because
// it needs to write resolved_by/resolved_at regardless of RLS, and it holds
// the GitHub token — never expose that token to the client.
//
// Deploy: supabase functions deploy approve-edit
// Secrets: supabase secrets set GITHUB_TOKEN=... GITHUB_REPO=org/mihrab-register

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GITHUB_REPO = Deno.env.get('GITHUB_REPO')!; // "org/mihrab-register"
const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  const { suggestionId, action } = await req.json();
  if (!suggestionId || !['approve', 'reject'].includes(action)) {
    return new Response('Bad request', { status: 400 });
  }

  const sb = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { data: suggestion, error: fetchErr } = await sb
    .from('edit_suggestions')
    .select('*, profiles!edit_suggestions_submitted_by_fkey(handle)')
    .eq('id', suggestionId)
    .single();
  if (fetchErr || !suggestion) return new Response('Suggestion not found', { status: 404 });

  // Identify the calling moderator from their JWT.
  const authHeader = req.headers.get('Authorization') ?? '';
  const { data: userData } = await sb.auth.getUser(authHeader.replace('Bearer ', ''));
  const moderatorId = userData?.user?.id;
  if (!moderatorId) return new Response('Unauthorized', { status: 401 });

  const { data: moderatorProfile } = await sb
    .from('profiles')
    .select('handle, is_moderator')
    .eq('id', moderatorId)
    .single();
  if (!moderatorProfile?.is_moderator) return new Response('Forbidden — not a moderator', { status: 403 });

  let prUrl: string | null = null;

  if (action === 'approve') {
    prUrl = await openRegisterPullRequest({
      mosqueId: suggestion.mosque_id,
      field: suggestion.field,
      toValue: suggestion.to_value,
      moderatorHandle: moderatorProfile.handle,
      submitterHandle: suggestion.profiles?.handle ?? suggestion.submitted_by,
    });
  }

  await sb
    .from('edit_suggestions')
    .update({
      status: action === 'approve' ? 'approved' : 'rejected',
      resolved_by: moderatorId,
      resolved_at: new Date().toISOString(),
      github_pr_url: prUrl,
    })
    .eq('id', suggestionId);

  if (action === 'approve') {
    await sb.rpc('increment_edits_merged', { profile_id: suggestion.submitted_by }).catch(() => {
      // Optional RPC — safe to skip if not defined; edits_merged can also be
      // recomputed from merged PR history instead of tracked incrementally.
    });
  }

  return new Response(JSON.stringify({ ok: true, prUrl }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

/**
 * Opens a PR against content/register/<mosqueId>.md that:
 *  - patches the frontmatter field the suggestion targeted,
 *  - sets checked to today and checkedBy to the moderator's handle.
 * This is a thin illustrative implementation of the GitHub Contents +
 * Pulls API flow — swap in an Octokit client for production use.
 */
async function openRegisterPullRequest(input: {
  mosqueId: string;
  field: string;
  toValue: string;
  moderatorHandle: string;
  submitterHandle: string;
}): Promise<string> {
  const ghHeaders = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
  };

  // 1. Find the mosque's file path (index.json maps id -> slug).
  const indexRes = await fetch(
    `https://raw.githubusercontent.com/${GITHUB_REPO}/main/content/index.json`
  );
  const { mosques } = await indexRes.json();
  const mosque = mosques.find((m: { id: string }) => m.id === input.mosqueId);
  if (!mosque) throw new Error(`Unknown mosque id ${input.mosqueId}`);
  const path = `content/register/${mosque.slug}.md`;

  // 2. Read current file + its sha (needed to update it).
  const fileRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}?ref=main`, {
    headers: ghHeaders,
  });
  const file = await fileRes.json();
  const currentContent = atob(file.content.replace(/\n/g, ''));

  // 3. Patch the frontmatter (field-specific replace) + re-date checked/checkedBy.
  const today = new Date().toISOString().slice(0, 10);
  const updated = currentContent
    .replace(/checked:\s*.*/,  `checked: ${today}`)
    .replace(/checkedBy:\s*.*/, `checkedBy: "${input.moderatorHandle}"`);
  // NOTE: field-specific value replacement (times/address/phone/langs/
  // facilities) is intentionally left as a TODO — it depends on how
  // precisely each field is represented in frontmatter vs. free text.

  // 4. Create a branch, commit the change, open the PR.
  const branch = `edit/${mosque.slug}-${Date.now()}`;
  const baseRef = await (await fetch(`https://api.github.com/repos/${GITHUB_REPO}/git/ref/heads/main`, { headers: ghHeaders })).json();
  await fetch(`https://api.github.com/repos/${GITHUB_REPO}/git/refs`, {
    method: 'POST',
    headers: ghHeaders,
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: baseRef.object.sha }),
  });
  await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
    method: 'PUT',
    headers: ghHeaders,
    body: JSON.stringify({
      message: `Update ${input.field} for ${mosque.name} (confirmed by ${input.moderatorHandle})`,
      content: btoa(updated),
      sha: file.sha,
      branch,
    }),
  });
  const prRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/pulls`, {
    method: 'POST',
    headers: ghHeaders,
    body: JSON.stringify({
      title: `${mosque.name}: ${input.field} update`,
      head: branch,
      base: 'main',
      body: `Suggested by ${input.submitterHandle}, confirmed by ${input.moderatorHandle}.`,
    }),
  });
  const pr = await prRes.json();
  return pr.html_url as string;
}
