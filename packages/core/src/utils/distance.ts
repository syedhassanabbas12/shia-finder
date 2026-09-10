import type { GeoPosition, Mosque, MosqueWithDistance } from '../types';

const EARTH_RADIUS_M = 6371000;

export function haversineMeters(a: GeoPosition, b: GeoPosition): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

const AVERAGE_WALK_METERS_PER_MIN = 80; // ~4.8 km/h

export function withDistance(mosques: Mosque[], from: GeoPosition | null): MosqueWithDistance[] {
  return mosques.map((m) => {
    if (!from) return { ...m, distanceMeters: null, walkMinutes: null };
    const distanceMeters = haversineMeters(from, m.coordinates);
    return {
      ...m,
      distanceMeters,
      walkMinutes: Math.round(distanceMeters / AVERAGE_WALK_METERS_PER_MIN),
    };
  });
}

export function sortByDistance(mosques: MosqueWithDistance[]): MosqueWithDistance[] {
  return [...mosques].sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity));
}

/** "420 m" / "1.8 km" / "0.3 mi" depending on unit preference. */
export function formatDistance(meters: number | null, units: 'metric' | 'miles' = 'metric'): string {
  if (meters == null) return '—';
  if (units === 'miles') return `${(meters / 1609).toFixed(1)} mi`;
  return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`;
}

export function formatWalk(minutes: number | null): string {
  if (minutes == null) return '—';
  if (minutes < 1) return 'less than a minute walk';
  return `${minutes} min walk`;
}
