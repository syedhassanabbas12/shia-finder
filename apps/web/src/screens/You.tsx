import { useState } from 'react';
import { useAppState } from '../AppState';

export default function You() {
  const { auth, favorites, mosques, theme, toggleTheme, locationOn, setLocationOn, supabaseConfigured } = useAppState();
  const [email, setEmail] = useState('');

  if (!auth?.session) {
    return (
      <div className="screen-scroll" style={{ padding: 18 }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 22, marginTop: 22 }}>You</div>
        <p style={{ fontSize: 13, color: 'var(--color-neutral-700)', margin: '9px 0 18px' }}>
          Sign in to save favourites, keep a quiet log of your visits, and — if the community asks you to — get
          access to the review queue. Reading and reporting stay open to everyone either way.
        </p>
        {supabaseConfigured ? (
          <div className="field" style={{ display: 'flex', gap: 9 }}>
            <input className="input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="btn btn-primary" onClick={() => auth?.signInWithEmail(email)}>Send link</button>
          </div>
        ) : (
          <p style={{ fontSize: 12, color: 'var(--color-neutral-700)' }}>
            Supabase isn't configured yet — set VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in apps/web/.env to enable
            sign-in.
          </p>
        )}
        <hr className="hr" />
        <div style={{ fontSize: 13.5, marginBottom: 8 }}>Appearance</div>
        <div className="seg" style={{ width: '100%', marginBottom: 18 }}>
          <label className={`seg-opt ${theme === 'light' ? 'active' : ''}`} style={{ flex: 1, justifyContent: 'center' }}>
            <input type="radio" checked={theme === 'light'} onChange={() => theme !== 'light' && toggleTheme()} style={{ display: 'none' }} /><span>Light</span>
          </label>
          <label className={`seg-opt ${theme === 'dark' ? 'active' : ''}`} style={{ flex: 1, justifyContent: 'center' }}>
            <input type="radio" checked={theme === 'dark'} onChange={() => theme !== 'dark' && toggleTheme()} style={{ display: 'none' }} /><span>Dark</span>
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderTop: '1px solid var(--color-divider)', paddingTop: 12 }}>
          <div>
            <div style={{ fontSize: 13.5 }}>Location</div>
            <div style={{ fontSize: 11.5, color: 'var(--color-neutral-700)' }}>{locationOn ? 'Granted while using the app.' : 'Off — search by city instead.'}</div>
          </div>
          <button className="btn btn-secondary" onClick={() => setLocationOn(!locationOn)}>{locationOn ? 'Turn off' : 'Allow'}</button>
        </div>
      </div>
    );
  }

  const favMosques = mosques.filter((m) => favorites?.favoriteIds.includes(m.id));
  const handle = `@${auth.session.user.email?.split('@')[0] ?? 'you'}`;

  return (
    <div className="screen-scroll" style={{ padding: 18 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 22, marginTop: 22 }}>{handle}</div>
      <div style={{ fontSize: 11.5, color: 'var(--color-neutral-700)', marginBottom: 18 }}>Member of the community register</div>

      <div style={{ fontSize: 10, letterSpacing: '.11em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 4 }}>Favourites</div>
      {favMosques.length === 0 && <div style={{ fontSize: 12.5, color: 'var(--color-neutral-700)', padding: '12px 0', borderTop: '1px solid var(--color-divider)' }}>Nothing saved yet — tap the heart on any record and it lands here.</div>}
      {favMosques.map((m) => (
        <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid var(--color-divider)' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 16 }}>{m.name}</span>
        </div>
      ))}

      <hr className="hr" />
      <div style={{ fontSize: 13.5, marginBottom: 8 }}>Appearance</div>
      <div className="seg" style={{ width: '100%', marginBottom: 18 }}>
        <label className={`seg-opt ${theme === 'light' ? 'active' : ''}`} style={{ flex: 1, justifyContent: 'center' }}>
          <input type="radio" checked={theme === 'light'} onChange={() => theme !== 'light' && toggleTheme()} style={{ display: 'none' }} /><span>Light</span>
        </label>
        <label className={`seg-opt ${theme === 'dark' ? 'active' : ''}`} style={{ flex: 1, justifyContent: 'center' }}>
          <input type="radio" checked={theme === 'dark'} onChange={() => theme !== 'dark' && toggleTheme()} style={{ display: 'none' }} /><span>Dark</span>
        </label>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderTop: '1px solid var(--color-divider)', paddingTop: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 13.5 }}>Location</div>
          <div style={{ fontSize: 11.5, color: 'var(--color-neutral-700)' }}>{locationOn ? 'Granted while using the app.' : 'Off — search by city instead.'}</div>
        </div>
        <button className="btn btn-secondary" onClick={() => setLocationOn(!locationOn)}>{locationOn ? 'Turn off' : 'Allow'}</button>
      </div>
      <button className="btn btn-ghost" onClick={() => auth.signOut()}>Sign out</button>
    </div>
  );
}
