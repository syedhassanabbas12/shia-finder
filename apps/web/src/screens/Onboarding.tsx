import { useNavigate } from 'react-router-dom';
import { useAppState } from '../AppState';

export default function Onboarding() {
  const nav = useNavigate();
  const { setLocationOn, theme } = useAppState();

  const go = (grant: boolean) => {
    setLocationOn(grant);
    nav('/home');
  };

  return (
    <div data-theme={theme} className="phone-shell" style={{ display: 'grid', placeItems: 'center', padding: 18 }}>
      <div className="dialog" style={{ boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: 34, lineHeight: 1.05, letterSpacing: '-.02em' }}>
          Salaam.<br />Let's find you a jamaat.
        </div>
        <div style={{ fontSize: 14, opacity: 0.85, textAlign: 'justify' }}>
          Share your location and Mihrab will put the nearest mosque — and the next jamaat you can still make —
          at the top of the screen. Nothing is sent to a server; the whole register is public data.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <button className="btn btn-primary btn-block" style={{ minHeight: 46, margin: 0 }} onClick={() => go(true)}>
            Use my location
          </button>
          <button className="btn btn-secondary btn-block" style={{ minHeight: 46, margin: 0 }} onClick={() => go(true)}>
            Just this once
          </button>
          <button className="btn btn-ghost btn-block" style={{ minHeight: 44, margin: 0, fontSize: 13 }} onClick={() => go(false)}>
            I'll search a city instead
          </button>
        </div>
        <hr className="hr" style={{ margin: '9px 0' }} />
        <div style={{ fontSize: 11.5, color: 'var(--color-neutral-700)', textAlign: 'justify' }}>
          No account needed to look anything up. Registering only adds your favourites, a quiet log of visits, and —
          if the community asks you to — the review queue.
        </div>
      </div>
    </div>
  );
}
