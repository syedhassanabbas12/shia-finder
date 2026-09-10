import { useEffect, useState } from 'react';
import type { Session, SupabaseClient } from '@supabase/supabase-js';

export function useAuth(sb: SupabaseClient) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [sb]);

  const signInWithEmail = (email: string) =>
    sb.auth.signInWithOtp({ email, options: { emailRedirectTo: undefined } });

  const signOut = () => sb.auth.signOut();

  return { session, loading, signInWithEmail, signOut, isSignedIn: !!session };
}
