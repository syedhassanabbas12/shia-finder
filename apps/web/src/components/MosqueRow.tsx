import type { MosqueWithDistance } from '@mihrab/core';
import { formatDistance, isStale } from '@mihrab/core';
import VerifiedBadge from './VerifiedBadge';

export default function MosqueRow({ m, onSelect }: { m: MosqueWithDistance; onSelect: () => void }) {
  const stale = isStale(m.checked, m.verified);
  return (
    <button
      onClick={onSelect}
      style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', padding: '13px 0', borderTop: '1px solid var(--color-divider)' }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 16.5 }}>
          {m.name} {!stale && <VerifiedBadge size={12.5} />}
        </span>
        <span style={{ fontSize: 11, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '.05em', flex: 'none' }}>
          {formatDistance(m.distanceMeters)}
        </span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--color-neutral-700)', marginTop: 3 }}>
        {m.school} · {m.area}
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 7, flexWrap: 'wrap' }}>
        <span className={stale ? 'tag tag-outline' : 'tag tag-accent'} style={{ fontSize: 9.5 }}>
          {stale ? 'Needs a check' : `Verified ${m.checked}`}
        </span>
        {m.facilities.slice(0, 2).map((f) => (
          <span key={f} className="tag tag-neutral" style={{ fontSize: 9.5 }}>{f}</span>
        ))}
      </div>
    </button>
  );
}
