import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FACILITIES = ["Women's section", 'Wudhu', 'Parking', 'Step-free', 'Library'];

export default function AddMosque() {
  const nav = useNavigate();
  const [needs, setNeeds] = useState<string[]>([]);
  const toggle = (f: string) => setNeeds((p) => (p.includes(f) ? p.filter((x) => x !== f) : [...p, f]));

  return (
    <div className="screen-scroll">
      <div style={{ padding: '20px 12px 8px', borderBottom: '1px solid var(--color-divider)' }}>
        <div style={{ fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 4 }}>
          Step 1 of 3 · the essentials
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 22 }}>Add a mosque</div>
      </div>
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ flex: 1, height: 3, background: 'var(--color-accent)' }} />
          <div style={{ flex: 1, height: 3, background: 'var(--color-divider)' }} />
          <div style={{ flex: 1, height: 3, background: 'var(--color-divider)' }} />
        </div>
        <div className="field"><label>Name, as the community says it</label><input className="input" placeholder="Idara-e-Jaaferiya" /></div>
        <div className="field"><label>Address</label><textarea className="input" placeholder="Street, area, postcode" /></div>
        <div className="field">
          <label>School</label>
          <div className="seg" style={{ width: '100%' }}>
            {['Ithna Ashari', 'Ismaili', 'Bohra'].map((s, i) => (
              <label key={s} className={`seg-opt ${i === 0 ? 'active' : ''}`} style={{ flex: 1, justifyContent: 'center' }}>
                <input type="radio" name="newschool" defaultChecked={i === 0} style={{ display: 'none' }} /><span>{s}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="field"><label>Languages of the khutba</label><input className="input" placeholder="Urdu, English" /></div>
        <div>
          <div style={{ fontSize: 10, letterSpacing: '.11em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 8 }}>Facilities</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {FACILITIES.map((f) => (
              <button key={f} onClick={() => toggle(f)} className={`btn ${needs.includes(f) ? 'btn-primary' : 'btn-secondary'}`}>{f}</button>
            ))}
          </div>
        </div>
        <div style={{ border: '1px solid var(--color-divider)', borderRadius: 4, padding: 12 }}>
          <div style={{ fontSize: 10, letterSpacing: '.11em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 7 }}>Drop the pin</div>
          <div style={{ height: 100, background: 'var(--color-neutral-100)', border: '1px solid var(--color-divider)', borderRadius: 2, display: 'grid', placeItems: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8"><path d="M12 2a6.5 6.5 0 016.5 6.5c0 4.6-6.5 12-6.5 12S5.5 13.1 5.5 8.5A6.5 6.5 0 0112 2z" /></svg>
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-neutral-700)', marginTop: 7 }}>
            Drag to place it on the door, not the car park — people follow this pin in the dark.
          </div>
        </div>
        <button className="btn btn-primary btn-block" onClick={() => nav('/home')}>Next: timings</button>
        <p style={{ fontSize: 11.5, color: 'var(--color-neutral-700)', margin: 0 }}>
          New entries land in the review queue as a fresh markdown file. Two moderators confirm a new mosque before
          it appears on the map.
        </p>
      </div>
    </div>
  );
}
