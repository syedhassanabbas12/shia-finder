// Shapes shared by the web app, the mobile app, and the register/Supabase
// data layers. Keep this file free of any framework import.

export type School = 'Ithna Ashari' | 'Ismaili' | 'Bohra';

export interface PrayerTime {
  adhan: string;
  jamaat: string;
}

export interface JamaatTimes {
  fajr: PrayerTime;
  zohr: PrayerTime;
  asr: PrayerTime;
  maghrib: PrayerTime;
  isha: PrayerTime;
}

/** One entry from content/index.json — i.e. one register/*.md file. */
export interface Mosque {
  id: string;
  slug: string;
  name: string;
  school: School;
  area: string;
  address: string;
  coordinates: { lat: number; lng: number };
  languages: string[];
  phone: string;
  website: string;
  facilities: string[];
  verified: boolean;
  checked: string; // ISO date
  checkedBy: string;
  addedBy: string;
  jamaat: JamaatTimes;
  timesNote: string;
  event: string;
  notes: string;
  notesBy: string;
}

/** A mosque plus values computed against the user's current position. */
export interface MosqueWithDistance extends Mosque {
  distanceMeters: number | null;
  walkMinutes: number | null;
}

export type EditableField = 'times' | 'address' | 'phone' | 'langs' | 'facilities';

export type EditStatus = 'pending' | 'approved' | 'rejected';

/** Row in the Supabase `edit_suggestions` table. */
export interface EditSuggestion {
  id: string;
  mosqueId: string;
  field: EditableField;
  fromValue: string;
  toValue: string;
  source: string;
  submittedBy: string; // profile handle
  submittedAt: string; // ISO timestamp
  status: EditStatus;
  resolvedBy: string | null;
  resolvedAt: string | null;
}

/** Row in the Supabase `profiles` table. */
export interface Profile {
  id: string; // auth.users.id
  handle: string;
  language: 'English' | 'اردو' | 'العربية';
  createdAt: string;
  isModerator: boolean;
  moderatorArea: string | null;
  editsMerged: number;
}

/** Row in the Supabase `favorites` table. */
export interface Favorite {
  profileId: string;
  mosqueId: string;
  createdAt: string;
}

/** Row in the Supabase `visits` table. */
export interface Visit {
  id: string;
  profileId: string;
  mosqueId: string;
  what: string; // e.g. "Maghrib jamaat"
  occurredAt: string;
}

export interface GeoPosition {
  lat: number;
  lng: number;
}
