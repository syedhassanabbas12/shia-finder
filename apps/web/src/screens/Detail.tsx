import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatCheckedLine, isStale, withDistance, formatDistance, formatWalk } from '@mihrab/core';
import { useAppState } from '../AppState';
import VerifiedBadge from '../components/VerifiedBadge';

const PRAYER_ORDER = ['fajr', 'zohr', 'asr', 'maghrib', 'isha'] as const;
const PRAYER_LABEL: Record<(typeof PRAYER_ORDER)[number], string> = {
  fajr: 'Fajr', zohr: 'Zohr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha',
};

export default function Detail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { mosques, position, favorites, auth } = useAppState();
  const [directionsOpen, setDirectionsOpen] = useState(false);

  const mosque = mosques.find((m) => m.id === id);
  const [withDist] = useMemo(() => (mosque ? withDistance([mosque], position) : []), [mosque, position]);

  if (!mosque || !withDist) {
    return <div style={{ padding: 24 }}>Loading…</div>;
  }

  const stale = isStale(mosque.checked, mosque.verified);
  const isFav = favorites?.favoriteIds.includes(mosque.id) ?? false;

  const requireAuth = (action: () => void) => {
    if (!auth?.session) { alert('Sign in to save favourites, log visits, or suggest edits.'); return; }
    action();
  };

  return (
    <div className="screen-scroll" style={{ position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--color-bg)', padding: '20px 12px 8px', borderBottom: '1px solid var(--color-divider)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button className="btn btn-ghost" style={{ minHeight: 44, minWidth: 44 }} onClick={() => nav(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <div style={{ flex: 1, fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--color-neutral-700)' }}>
          register/{mosque.slug}.md
        </div>
        <button className="btn btn-ghost" style={{ minHeight: 44, minWidth: 44 }} onClick={() => requireAuth(() => favorites!.toggle(mosque.id))}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6"><path d="M12 20.5l-7-6.8A4.6 4.6 0 1112 7.3a4.6 4.6 0 117 6.4z" /></svg>
        </button>
      </div>

      <div style={{ padding: '18px 18px 80px' }}>
        <div style={{ height: 128, background: 'var(--color-neutral-200)', display: 'grid', placeItems: 'center', borderRadius: 2 }}>
          <div style={{ textAlign: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-600)" strokeWidth="1.3" style={{ margin: '0 auto 6px' }}>
              <rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="M3 15l5-4 4 3 3-2 6 4" /><circle cx="8.5" cy="9.5" r="1.4" />
            </svg>
            <div style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--color-neutral-600)' }}>No photograph yet — send one in</div>
          </div>
        </div>

        <h3 style={{ margin: '12px 0 5px', fontSize: 27, letterSpacing: '-.02em' }}>{mosque.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 9 }}>
          {!stale && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
              <VerifiedBadge /> Verified
            </span>
          )}
          {stale && <span className="tag tag-outline" style={{ fontSize: 10 }}>Needs a check</span>}
          <span style={{ fontSize: 11.5, color: 'var(--color-neutral-700)' }}>{formatCheckedLine(mosque.checked, mosque.checkedBy, mosque.verified)}</span>
        </div>
        <p style={{ fontSize: 13.5, margin: '0 0 18px' }}>
          {mosque.address}<br />
          <span style={{ color: 'var(--color-neutral-700)' }}>{formatDistance(withDist.distanceMeters)} from you · {formatWalk(withDist.walkMinutes)}</span>
        </p>

        <div style={{ display: 'flex', gap: 9, marginBottom: 27 }}>
          <button className="btn btn-primary" style={{ flex: 1, minHeight: 46, margin: 0 }} onClick={() => setDirectionsOpen(true)}>Directions</button>
          <button className="btn btn-secondary" style={{ flex: 1, minHeight: 46, margin: 0 }} onClick={() => requireAuth(() => alert('Visit logged.'))}>I prayed here</button>
        </div>

        <div style={{ fontSize: 10, letterSpacing: '.11em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 9 }}>Jamaat timings</div>
        <table className="table" style={{ marginBottom: 9 }}>
          <thead><tr><th>Prayer</th><th style={{ textAlign: 'right' }}>Adhan</th><th style={{ textAlign: 'right' }}>Jamaat</th></tr></thead>
          <tbody>
            {PRAYER_ORDER.map((p) => (
              <tr key={p} className={p === 'maghrib' ? 'is-next' : ''}>
                <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{PRAYER_LABEL[p]}</td>
                <td style={{ textAlign: 'right', color: 'var(--color-neutral-700)' }}>{mosque.jamaat[p].adhan}</td>
                <td style={{ textAlign: 'right' }}>{mosque.jamaat[p].jamaat}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 11, color: 'var(--color-neutral-700)', marginBottom: 27 }}>{mosque.timesNote}</div>

        <div style={{ fontSize: 10, letterSpacing: '.11em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 9 }}>The record</div>
        <div style={{ marginBottom: 27 }}>
          {[
            { label: 'School', value: mosque.school },
            { label: 'Languages', value: mosque.languages.join(', ') },
            { label: 'Facilities', value: mosque.facilities.join(', ') },
            { label: 'Telephone', value: mosque.phone },
            { label: 'Website', value: mosque.website },
            { label: 'Entry in repo', value: `register/${mosque.slug}.md` },
          ].map((f) => (
            <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '11px 0', borderTop: '1px solid var(--color-divider)' }}>
              <div style={{ fontSize: 10, letterSpacing: '.09em', textTransform: 'uppercase', color: 'var(--color-neutral-700)', width: 88, flex: 'none' }}>{f.label}</div>
              <div style={{ flex: 1, fontSize: 13, textAlign: 'right' }}>{f.value}</div>
            </div>
          ))}
        </div>

        <div style={{ border: '1px solid var(--color-divider)', borderRadius: 4, padding: 12, marginBottom: 18 }}>
          <div style={{ fontSize: 10, letterSpacing: '.11em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 6 }}>What's on</div>
          <div style={{ fontSize: 13.5 }}>{mosque.event}</div>
          <hr className="hr" style={{ margin: '12px 0' }} />
          <div style={{ fontSize: 10, letterSpacing: '.11em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 6 }}>From the community</div>
          <div style={{ fontSize: 13, fontStyle: 'italic' }}>&ldquo;{mosque.notes}&rdquo;</div>
          <div style={{ fontSize: 11, color: 'var(--color-neutral-700)', marginTop: 6 }}>{mosque.notesBy}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <button className="btn btn-secondary btn-block" style={{ minHeight: 46, margin: 0 }} onClick={() => requireAuth(() => nav(`/edit/${mosque.id}`))}>
            Suggest an edit
          </button>
          <button className="btn btn-ghost btn-block" style={{ minHeight: 44, margin: 0, fontSize: 12, color: 'var(--color-neutral-700)' }}>
            Something wrong? Report it — no account needed
          </button>
        </div>
      </div>

      {directionsOpen && (
        <div className="dialog-backdrop" style={{ position: 'absolute' }} onClick={() => setDirectionsOpen(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-title">Open {mosque.name} in</div>
            {['Apple Maps', 'Google Maps', 'Citymapper'].map((app) => (
              <button key={app} onClick={() => setDirectionsOpen(false)} style={{ all: 'unset', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', padding: '13px 0', borderTop: '1px solid var(--color-divider)' }}>
                <span style={{ fontSize: 14.5 }}>{app}</span>
                <span style={{ fontSize: 11.5, color: 'var(--color-neutral-700)' }}>{formatWalk(withDist.walkMinutes)}</span>
              </button>
            ))}
            <button className="btn btn-secondary btn-block" onClick={() => setDirectionsOpen(false)}>Copy the address instead</button>
          </div>
        </div>
      )}
    </div>
  );
}
