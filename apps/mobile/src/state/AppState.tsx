// Mirrors apps/web/src/AppState.tsx — same shared-state shape, RN-specific
// bits only where the platform truly differs (AsyncStorage for the Supabase
// session, expo-location for position).
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import {
  createMihrabSupabaseClient,
  useAuth,
  useMosques,
  useFavorites,
  useEditQueue,
  type ThemeName,
  type Mosque,
} from '@mihrab/core';
import { config } from '../config';

const sb = config.supabaseUrl
  ? createMihrabSupabaseClient({ url: config.supabaseUrl, anonKey: config.supabaseAnonKey, storage: AsyncStorage })
  : null;

interface AppStateValue {
  theme: ThemeName;
  toggleTheme: () => void;
  mosques: Mosque[];
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
  const [locationOn, setLocationOnState] = useState(false);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  const { mosques, loading } = useMosques({ githubRepo: config.githubRepo });
  const auth = sb ? useAuth(sb) : null;
  const favorites = sb ? useFavorites(sb, auth?.session?.user.id ?? null) : null;
  const editQueue = sb && auth?.session ? useEditQueue(sb) : null;

  const setLocationOn = async (v: boolean) => {
    if (!v) { setLocationOnState(false); return; }
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') { setLocationOnState(false); return; }
    setLocationOnState(true);
    const pos = await Location.getCurrentPositionAsync({});
    setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
  };

  const value: AppStateValue = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    mosques,
    loading,
    selectedId: selectedId ?? mosques[0]?.id ?? null,
    select: setSelectedId,
    auth,
    favorites,
    editQueue,
    locationOn,
    setLocationOn,
    position,
    supabaseConfigured: !!sb,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [theme, mosques, loading, selectedId, auth?.session, favorites?.favoriteIds, editQueue?.queue, locationOn, position]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
