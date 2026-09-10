// App-wide state: theme, Supabase-backed auth/favorites, and the register.
// Kept as one context so screens read exactly what the original design's
// single shared component state did (tap a pin on Home, the record on
// Detail follows; confirm in the queue, the record re-dates itself; the
// theme switch flips every screen).

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  createMihrabSupabaseClient,
  useAuth,
  useMosques,
  useFavorites,
  useEditQueue,
  type ThemeName,
} from '@mihrab/core';
import { config } from './config';

const sb = config.supabaseUrl
  ? createMihrabSupabaseClient({ url: config.supabaseUrl, anonKey: config.supabaseAnonKey })
  : null;

interface AppStateValue {
  theme: ThemeName;
  toggleTheme: () => void;
  mosques: ReturnType<typeof useMosques>['mosques'];
  loading: boolean;
  selectedId: string | null;
  select: (id: string) => void;
  auth: ReturnType<typeof useAuth> | null;
  favorites: ReturnType<typeof useFavorites> | null;
  editQueue: ReturnType<typeof useEditQueue> | null;
  locationOn: boolean;
  setLocationOn: (v: boolean) => void;
  position: { lat: number; lng: number } | null;
  supabaseConfigured: boolean;
}

const Ctx = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>('light');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [locationOn, setLocationOn] = useState(false);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  const { mosques, loading } = useMosques({ githubRepo: config.githubRepo });

  // Placeholder auth/favorites/queue hooks only run once Supabase is wired
  // up (see apps/web/.env.example) — the UI degrades gracefully without it.
  const auth = sb ? useAuth(sb) : null;
  const favorites = sb ? useFavorites(sb, auth?.session?.user.id ?? null) : null;
  const editQueue = sb && auth?.session ? useEditQueue(sb) : null;

  const select = (id: string) => setSelectedId(id);

  const enableLocation = () => {
    setLocationOn(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setPosition(null)
      );
    }
  };

  const value: AppStateValue = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    mosques,
    loading,
    selectedId: selectedId ?? mosques[0]?.id ?? null,
    select,
    auth,
    favorites,
    editQueue,
    locationOn,
    setLocationOn: (v: boolean) => (v ? enableLocation() : setLocationOn(false)),
    position,
    supabaseConfigured: !!sb,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [theme, mosques, loading, selectedId, auth?.session, favorites?.favoriteIds, editQueue?.queue, locationOn, position]);

  return (
    <div data-theme={theme} style={{ minHeight: '100%' }}>
      <Ctx.Provider value={value}>{children}</Ctx.Provider>
    </div>
  );
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
