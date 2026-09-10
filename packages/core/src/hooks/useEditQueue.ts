import { useCallback, useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { EditSuggestion } from '../types';
import { approveEdit, listReviewQueue, rejectEdit } from '../api/moderation';

export function useEditQueue(sb: SupabaseClient) {
  const [queue, setQueue] = useState<EditSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    listReviewQueue(sb).then(setQueue).catch(() => {}).finally(() => setLoading(false));
  }, [sb]);

  useEffect(refresh, [refresh]);

  const approve = useCallback(async (id: string) => {
    setQueue((q) => q.filter((s) => s.id !== id)); // optimistic
    try { await approveEdit(sb, id); } catch { refresh(); }
  }, [sb, refresh]);

  const reject = useCallback(async (id: string) => {
    setQueue((q) => q.filter((s) => s.id !== id));
    try { await rejectEdit(sb, id); } catch { refresh(); }
  }, [sb, refresh]);

  return { queue, loading, approve, reject, refresh };
}
