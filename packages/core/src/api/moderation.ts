import type { SupabaseClient } from '@supabase/supabase-js';
import type { EditSuggestion } from '../types';
import { mapEditSuggestionRow } from './edits';

export async function listReviewQueue(sb: SupabaseClient): Promise<EditSuggestion[]> {
  const { data, error } = await sb
    .from('edit_suggestions')
    .select('*')
    .eq('status', 'pending')
    .order('submitted_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapEditSuggestionRow);
}

/**
 * Approving invokes the `approve-edit` Supabase Edge Function, which:
 *   1. marks the suggestion approved in Postgres, stamped with the
 *      moderator's handle and the current time;
 *   2. opens a pull request against content/register/<mosque>.md via the
 *      GitHub API, updating the field and re-dating `checked`/`checkedBy`.
 * See /supabase/functions/approve-edit for the implementation.
 */
export async function approveEdit(sb: SupabaseClient, suggestionId: string): Promise<void> {
  const { error } = await sb.functions.invoke('approve-edit', {
    body: { suggestionId, action: 'approve' },
  });
  if (error) throw error;
}

export async function rejectEdit(sb: SupabaseClient, suggestionId: string): Promise<void> {
  const { error } = await sb.functions.invoke('approve-edit', {
    body: { suggestionId, action: 'reject' },
  });
  if (error) throw error;
}

export async function isModerator(sb: SupabaseClient, profileId: string): Promise<boolean> {
  const { data, error } = await sb.from('profiles').select('is_moderator').eq('id', profileId).single();
  if (error) return false;
  return !!data?.is_moderator;
}
