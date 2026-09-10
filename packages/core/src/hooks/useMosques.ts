import { useEffect, useState } from 'react';
import { fetchRegisterIndex, type RegisterConfig } from '../register';
import type { Mosque } from '../types';

export function useMosques(cfg: RegisterConfig) {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchRegisterIndex(cfg)
      .then((data) => { if (!cancelled) setMosques(data); })
      .catch((err) => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg.githubRepo, cfg.ref]);

  return { mosques, loading, error };
}
