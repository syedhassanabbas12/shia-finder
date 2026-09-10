import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { withDistance, sortByDistance, formatDistance, formatWalk } from '@mihrab/core';
import { useAppState } from '../AppState';
import VerifiedBadge from '../components/VerifiedBadge';

const HARROWFIELD = { lat: 51.5556, lng: -0.038 };

export default function Home() {
  const nav = useNavigate();
  const { mosques, loading, position, locationOn, setLocationOn, toggleTheme, select } = useAppState();

  const withDist = useMemo(() => sortByDistance(withDistance(mosques, position ?? HARROWFIELD)), [mosques, position]);
  const hero = withDist[0];
  const alsoNear = withDist.slice(1, 4);

  const openMosque = (id: string) => {
    select(id);
    nav(`/detail/${id}`);
  };

  return (
    <>
      <div className="screen-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingTop: 40 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 22, letterSpacing: '-.01em' }}>Mihrab</div>
          <div style={{ fontSize: 9.5, letterSpacing: '.13em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
            Harrowfield · {loading ? '…' : `${withDist.length} ${withDist.length === 1 ? 'mosque' : 'mosques'}`}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-secondary btn-icon" onClick={() => nav('/search')}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4.3-4.3" /></svg>
          </button>
          <button className="btn btn-secondary btn-icon" onClick={toggleTheme}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20 14.5A8.5 8.5 0 019.5 4a7.5 7.5 0 1010.5 10.5z" /></svg>
          </button>
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <MapContainer center={[HARROWFIELD.lat, HARROWFIELD.lng]} zoom={14} style={{ width: '100%', height: '100%' }} zoomControl={false}>
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {withDist.map((m) => (
            <Marker key={m.id} position={[m.coordinates.lat, m.coordinates.lng]} eventHandlers={{ click: () => openMosque(m.id) }}>
              <Popup>{m.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
        <button
          className="btn btn-secondary"
          style={{ position: 'absolute', right: 12, bottom: 12, width: 44, height: 44, padding: 0, background: 'var(--color-bg)', boxShadow: 'var(--shadow-sm)', zIndex: 500 }}
          onClick={() => setLocationOn(!locationOn)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="1.7" fill="currentColor" /></svg>
        </button>
      </div>

      <div style={{ flex: 'none', background: 'var(--color-bg)', borderTop: '1px solid var(--color-divider)', boxShadow: 'var(--shadow-md)', padding: '9px 18px 9px', zIndex: 400 }}>
        <div style={{ width: 44, height: 3, borderRadius: 2, background: 'var(--color-divider)', margin: '0 auto 13px' }} />
        {hero && (
          <button
            onClick={() => openMosque(hero.id)}
            style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', borderBottom: '1px solid var(--color-divider)', paddingBottom: 13, marginBottom: 4 }}
          >
            <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 5 }}>
              Nearest to you now
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: 29, lineHeight: 1.08, letterSpacing: '-.02em', marginBottom: 6 }}>
              {hero.name}
            </div>
            <div style={{ display: 'flex', gap: 8, fontSize: 13, alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-accent-700)' }}>{hero.jamaat.maghrib.jamaat}</span>
              <span style={{ color: 'var(--color-neutral-700)' }}>·</span>
              <span>{formatWalk(hero.walkMinutes)}</span>
              <span style={{ color: 'var(--color-neutral-700)' }}>·</span>
              <span>{formatDistance(hero.distanceMeters)}</span>
            </div>
          </button>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '9px 0 0' }}>
          <h6 style={{ margin: 0 }}>Also near</h6>
          <span style={{ fontSize: 10.5, color: 'var(--color-neutral-700)' }}>by walking time</span>
        </div>
        {alsoNear.map((m) => (
          <button
            key={m.id}
            onClick={() => openMosque(m.id)}
            style={{ all: 'unset', cursor: 'pointer', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1px 12px', padding: '10px 0', borderTop: '1px solid var(--color-divider)', minHeight: 44, width: '100%' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 15.5 }}>
              <span>{m.name}</span>
              <VerifiedBadge size={12.5} />
            </div>
            <div style={{ gridColumn: 2, gridRow: 1, textAlign: 'right', fontSize: 11, color: 'var(--color-accent)', textTransform: 'uppercase' }}>
              {formatDistance(m.distanceMeters)}
            </div>
            <div style={{ gridRow: 2, fontSize: 11.5, color: 'var(--color-neutral-700)' }}>{m.school} · {formatWalk(m.walkMinutes)}</div>
          </button>
        ))}
      </div>
    </>
  );
}
