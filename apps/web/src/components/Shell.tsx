import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppState } from '../AppState';

const TABS = [
  { path: '/home', label: 'Near me' },
  { path: '/search', label: 'Search' },
  { path: '/moderate', label: 'Review', modOnly: true },
  { path: '/you', label: 'You' },
];

export default function Shell() {
  const nav = useNavigate();
  const loc = useLocation();
  const { editQueue } = useAppState();
  const showModerate = !!editQueue; // tab only appears once signed in as a moderator

  const tabs = TABS.filter((t) => !t.modOnly || showModerate);

  return (
    <div className="phone-shell">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Outlet />
      </div>
      <nav className="tabbar">
        {tabs.map((t) => {
          const active = loc.pathname.startsWith(t.path);
          return (
            <button
              key={t.path}
              className="tabbar-item"
              style={{ color: active ? 'var(--color-accent)' : 'var(--color-neutral-600)' }}
              onClick={() => nav(t.path)}
            >
              <span style={{ width: 16, height: 16, border: '1.4px solid currentColor', borderRadius: t.path === '/search' ? '50%' : 2, display: 'block' }} />
              <span style={{ fontSize: 9.5, letterSpacing: '.04em' }}>{t.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
