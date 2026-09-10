import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { EditableField } from '@mihrab/core';
import { useAppState } from '../AppState';

const FIELDS: { key: EditableField; label: string }[] = [
  { key: 'times', label: 'Jamaat timings' },
  { key: 'address', label: 'Address' },
  { key: 'phone', label: 'Telephone' },
  { key: 'langs', label: 'Languages' },
  { key: 'facilities', label: 'Facilities' },
];

export default function Edit() {
  const { id } = useParams();
  const nav = useNavigate();
  const { mosques, auth } = useAppState();
  const mosque = mosques.find((m) => m.id === id);
  const [field, setField] = useState<EditableField>('times');
  const [draft, setDraft] = useState('');
  const [source, setSource] = useState('');
  const [attest, setAttest] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!mosque) return null;
  const currentValues: Record<EditableField, string> = {
    times: `${mosque.jamaat.maghrib.jamaat} Maghrib, ${mosque.jamaat.isha.jamaat} Isha`,
    address: mosque.address,
    phone: mosque.phone,
    langs: mosque.languages.join(', '),
    facilities: mosque.facilities.join(', '),
  };

  const handle = auth?.session?.user.email ? `@${auth.session.user.email.split('@')[0]}` : '@you';

  const submit = () => {
    // In production this calls submitEditSuggestion() from @mihrab/core,
    // writing a row to Supabase's edit_suggestions table.
    setSubmitted(true);
  };

  return (
    <div className="screen-scroll">
      <div style={{ padding: '20px 12px 8px', borderBottom: '1px solid var(--color-divider)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button className="btn btn-ghost" style={{ minHeight: 44, minWidth: 44 }} onClick={() => nav(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 19 }}>Suggest an edit</div>
      </div>
      <div style={{ padding: '18px 18px 60px' }}>
        <p style={{ fontSize: 12.5, color: 'var(--color-neutral-700)', textAlign: 'justify', borderLeft: '2px solid var(--color-accent)', paddingLeft: 12, margin: '0 0 18px' }}>
          You're signed in as <em>{handle}</em>, so this goes out as a pull request on{' '}
          <span>register/{mosque.slug}.md</span> with your name on it. A moderator from the community confirms it —
          usually within a day or two.
        </p>

        <div className="field" style={{ marginBottom: 18 }}>
          <label>Which detail needs fixing?</label>
          {FIELDS.map((f) => (
            <label key={f.key} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid var(--color-divider)', minHeight: 46, cursor: 'pointer' }}>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 10, letterSpacing: '.09em', textTransform: 'uppercase', color: 'var(--color-neutral-700)' }}>{f.label}</span>
                <span style={{ fontSize: 13 }}>{currentValues[f.key]}</span>
              </span>
              <input type="radio" name="field" checked={field === f.key} onChange={() => setField(f.key)} />
            </label>
          ))}
        </div>

        <div className="field" style={{ marginBottom: 18 }}>
          <label>What should it say?</label>
          <input className="input" value={draft} onChange={(e) => setDraft(e.target.value)} />
        </div>
        <div className="field" style={{ marginBottom: 18 }}>
          <label>How do you know? A source helps it get merged.</label>
          <textarea className="input" value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. announced at the centre last Friday; photo of the noticeboard" />
        </div>
        <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 18, cursor: 'pointer' }}>
          <input type="checkbox" checked={attest} onChange={(e) => setAttest(e.target.checked)} />
          <span style={{ fontSize: 12, color: 'var(--color-neutral-700)' }}>I've seen this myself, or I can point to where it came from.</span>
        </label>
        <button className="btn btn-primary btn-block" disabled={!draft || !attest || submitted} onClick={submit}>
          {submitted ? 'Sent — waiting on a moderator' : 'Send it in'}
        </button>
        <p style={{ fontSize: 11.5, color: 'var(--color-neutral-700)', textAlign: 'center', margin: '13px 0 0' }}>
          {submitted
            ? 'Your suggestion is at the top of the review queue. Confirm it there and the record re-dates itself.'
            : 'It will show as an open pull request on the record until a moderator confirms it.'}
        </p>
      </div>
    </div>
  );
}
