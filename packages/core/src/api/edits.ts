import type { SupabaseClient } from '@supabase/supabase-js';
import type { EditableField, EditSuggestion } from '../types';

export async function submitEditSuggestion(
  sb: SupabaseClient,
  input: { mosqueId: string; field: EditableField; fromValue: string; toValue: string; source: string }
): Promise<void> {
  const { error } = await sb.from('edit_suggestions').insert({
    mosque_id: input.mosqueId,
    field: input.field,
    from_value: input.fromValue,
    to_value: input.toValue,
    source: input.source,
    status: 'pending',
  });
  if (error) throw error;
}

export async function listPendingEditsForMosque(sb: SupabaseClient, mosqueId: string): Promise<EditSuggestion[]> {
  const { data, error } = await sb
    .from('edit_suggestions')
    .select('*')
    .eq('mosque_id', mosqueId)
    .eq('status', 'pending');
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

function mapRow(r: any): EditSuggestion {
  return {
    id: r.id,
    mosqueId: r.mosque_id,
    field: r.field,
    fromValue: r.from_value,
    toValue: r.to_value,
    source: r.source,
    submittedBy: r.submitted_by,
    submittedAt: r.submitted_at,
    status: r.status,
    resolvedBy: r.resolved_by,
    resolvedAt: r.resolved_at,
  };
}

export { mapRow as mapEditSuggestionRow };
