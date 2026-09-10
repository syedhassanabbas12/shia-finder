import type { SupabaseClient } from '@supabase/supabase-js';

export async function listFavorites(sb: SupabaseClient, profileId: string): Promise<string[]> {
  const { data, error } = await sb.from('favorites').select('mosque_id').eq('profile_id', profileId);
  if (error) throw error;
  return (data ?? []).map((r) => r.mosque_id as string);
}

export async function addFavorite(sb: SupabaseClient, profileId: string, mosqueId: string) {
  const { error } = await sb.from('favorites').upsert({ profile_id: profileId, mosque_id: mosqueId });
  if (error) throw error;
}

export async function removeFavorite(sb: SupabaseClient, profileId: string, mosqueId: string) {
  const { error } = await sb.from('favorites').delete().match({ profile_id: profileId, mosque_id: mosqueId });
  if (error) throw error;
}
