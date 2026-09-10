import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withDistance, sortByDistance, type School } from '@mihrab/core';
import { useAppState } from '../AppState';
import MosqueRow from '../components/MosqueRow';

const SCHOOLS: (School | 'All')[] = ['All', 'Ithna Ashari', 'Ismaili', 'Bohra'];
const FACILITIES = ["Women's section", 'Wudhu', 'Parking', 'Step-free', 'Library'];

export default function Search() {
  const nav = useNavigate();
  const { mosques, position, select } = useAppState();
  const [query, setQuery] = useState('');
  const [school, setSchool] = useState<(typeof SCHOOLS)[number]>('All');
  const [needs, setNeeds] = useState<string[]>([]);

  const results = useMemo(() => {
    const filtered = mosques.filter((m) =>
      (school === 'All' || m.school === school) &&
      needs.every((n) => m.facilities.includes(n)) &&
      (query.trim() === '' ||
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.area.toLowerCase().includes(query.toLowerCase()))
    );
    return sortByDistance(withDistance(filtered, position));
  }, [mosques, school, needs, query, position]);

  const toggleNeed = (f: string) =>
    setNeeds((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  return (
    <>
      <div className="screen-header" style={{ paddingTop: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--color-accent)', borderRadius: 4, padding: '0 10px', height: 44, marginBottom: 12 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" style={{ opacity: .55 }}><circle cx="11" cy="11" r="7" /><path d="M20 20l-4.3-4.3" /></svg>
          <input className="input" style={{ border: 0, height: 42, padding: 0, fontSize: 15 }} placeholder="A city, an area, or a mosque" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div style={{ fontSize: 10, letterSpacing: '.11em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 7 }}>School</div>
        <div className="seg" style={{ width: '100%', marginBottom: 12 }}>
          {SCHOOLS.map((s) => (
            <label key={s} className={`seg-opt ${school === s ? 'active' : ''}`} style={{ flex: 1, justifyContent: 'center' }}>
              <input type="radio" name="school" style={{ display: 'none' }} checked={school === s} onChange={() => setSchool(s)} />
              <span>{s}</span>
            </label>
          ))}
        </div>
        <div style={{ fontSize: 10, letterSpacing: '.11em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 7 }}>Must have</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {FACILITIES.map((f) => (
            <button key={f} onClick={() => toggleNeed(f)} className={`btn ${needs.includes(f) ? 'btn-primary' : 'btn-secondary'}`} style={{ minHeight: 34 }}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="screen-scroll" style={{ padding: '0 18px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '13px 0 4px' }}>
          <h6 style={{ margin: 0 }}>{results.length === 1 ? 'One in the register' : `${results.length} in the register`}</h6>
        </div>
        {results.map((m) => (
          <MosqueRow key={m.id} m={m} onSelect={() => { select(m.id); nav(`/detail/${m.id}`); }} />
        ))}
        <div style={{ borderTop: '1px solid var(--color-divider)', padding: '18px 0 0', marginTop: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 12.5, color: 'var(--color-neutral-700)', marginBottom: 9 }}>Somewhere missing from the register?</div>
          <button className="btn btn-primary" onClick={() => nav('/add')}>Add a mosque</button>
        </div>
      </div>
    </>
  );
}
