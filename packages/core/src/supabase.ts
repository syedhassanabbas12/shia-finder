// Supabase is used ONLY for the account-gated parts of the app (auth,
// favorites, visit history, edit suggestions, moderator roles). The mosque
// data itself never lives here — see register.ts. Both apps call
// createMihrabSupabaseClient() with env-provided credentials so this file
// has no platform-specific storage assumptions baked in.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseEnv {
  url: string;
  anonKey: string;
  /** Pass AsyncStorage on RN, undefined on web (falls back to localStorage). */
  storage?: {
    getItem(key: string): Promise<string | null> | string | null;
    setItem(key: string, value: string): Promise<void> | void;
    removeItem(key: string): Promise<void> | void;
  };
}

let client: SupabaseClient | null = null;

export function createMihrabSupabaseClient(env: SupabaseEnv): SupabaseClient {
  if (client) return client;
  client = createClient(env.url, env.anonKey, {
    auth: {
      storage: env.storage as never,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  return client;
}

export function getMihrabSupabaseClient(): SupabaseClient {
  if (!client) throw new Error('Call createMihrabSupabaseClient() once at app startup first.');
  return client;
}
