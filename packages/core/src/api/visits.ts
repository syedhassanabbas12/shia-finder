import type { SupabaseClient } from '@supabase/supabase-js';
import type { Visit } from '../types';

export async function listVisits(sb: SupabaseClient, profileId: string): Promise<Visit[]> {
  const { data, error } = await sb
    .from('visits')
    .select('id, profile_id, mosque_id, what, occurred_at')
    .eq('profile_id', profileId)
    .order('occurred_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    profileId: r.profile_id,
    mosqueId: r.mosque_id,
    what: r.what,
    occurredAt: r.occurred_at,
  }));
}

export async function logVisit(sb: SupabaseClient, profileId: string, mosqueId: string, what: string) {
  const { error } = await sb.from('visits').insert({ profile_id: profileId, mosque_id: mosqueId, what });
  if (error) throw error;
}
