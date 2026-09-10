import { useCallback, useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { addFavorite, listFavorites, removeFavorite } from '../api/favorites';

export function useFavorites(sb: SupabaseClient, profileId: string | null) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const refresh = useCallback(() => {
    if (!profileId) { setFavoriteIds([]); return; }
    listFavorites(sb, profileId).then(setFavoriteIds).catch(() => {});
  }, [sb, profileId]);

  useEffect(refresh, [refresh]);

  const toggle = useCallback(async (mosqueId: string) => {
    if (!profileId) return; // caller should prompt sign-in
    const isFav = favoriteIds.includes(mosqueId);
    setFavoriteIds((prev) => (isFav ? prev.filter((id) => id !== mosqueId) : [...prev, mosqueId])); // optimistic
    try {
      if (isFav) await removeFavorite(sb, profileId, mosqueId);
      else await addFavorite(sb, profileId, mosqueId);
    } catch {
      refresh(); // revert on failure
    }
  }, [sb, profileId, favoriteIds, refresh]);

  return { favoriteIds, toggle };
}
