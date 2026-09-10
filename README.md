# Mihrab — a community register of Shia mosques

A mosque finder built around one idea: the data is a public GitHub repo, not
a database. Anyone can look up a mosque with no account. Signing in only
unlocks personal state (favourites, visit history) and, for trusted
community members, a moderator queue that turns confirmed edits into real
pull requests against the register.

Ported from the Classical-system design mockup (`Mihrab - Mosque Finder.dc.html`)
into a real, running monorepo.

## Layout

```
mihrab/
├── content/
│   ├── register/        # ← the database: one .md file per mosque, public, PR-editable
│   ├── scripts/          # build-index.mjs — regenerates index.json from the .md files
│   └── index.json         # generated — what both apps actually fetch at runtime
├── packages/
│   └── core/              # shared TS: types, theme tokens, register reader, Supabase API, hooks
├── apps/
│   ├── web/                # Vite + React + react-leaflet
│   └── mobile/             # Expo (React Native) + react-native-maps
├── supabase/
│   ├── schema.sql           # profiles, favorites, visits, edit_suggestions + RLS
│   └── functions/approve-edit/  # moderator confirm → opens a GitHub PR
└── .github/workflows/build-index.yml  # rebuilds index.json on every register change
```

## Why this shape (answering the brief)

- **No login to find a mosque.** `useMosques()` in `@mihrab/core` fetches
  `content/index.json` straight from `raw.githubusercontent.com` — no API,
  no auth, no server. Search, the map, and mosque detail all work signed out.
- **Community-driven, moderator-checked.** Anyone signed in can suggest an
  edit (`edit_suggestions` table). A moderator confirming it in the review
  queue calls the `approve-edit` Edge Function, which opens a real PR against
  the `.md` file — the "commit with your name on it" from the design notes.
- **Public data, not a database.** The register only exists as Markdown in
  Git. Supabase holds *only* the account-gated layer: who's signed in, their
  favourites/visits, and the edit queue. If Supabase disappeared tomorrow,
  the register itself — and read-only browsing — would be unaffected.
- **One design system, two renderers.** `packages/core/src/theme.ts` is the
  Classical system's tokens (colors, spacing, fonts, radii) as plain JS. The
  web app turns them into CSS variables (`apps/web/src/theme.css`); the
  mobile app reads them directly into `StyleSheet` objects
  (`apps/mobile/src/theme.ts`). Same values, same light/dark themes, each
  platform's native styling approach.
- **Light/dark, location, and accounts** all work the way the mockup's
  "You" screen described: theme and location permission are local state
  (no account needed); favourites/visits/moderator status require sign-in
  via Supabase magic-link auth.

## Getting it running

```bash
npm install                       # installs the whole workspace

# 1. Point the apps at a real register repo (or use this one, once pushed to GitHub)
cp apps/web/.env.example apps/web/.env
cp apps/mobile/.env.example apps/mobile/.env
# fill in *_GITHUB_REGISTER_REPO=your-org/mihrab   (or wherever this repo lives)

# 2. (Optional but needed for accounts/favourites/moderation) set up Supabase
#    - create a project, run supabase/schema.sql against it
#    - fill in *_SUPABASE_URL / *_SUPABASE_ANON_KEY in both .env files
#    - deploy supabase/functions/approve-edit and set GITHUB_TOKEN / GITHUB_REPO secrets

npm run dev:web        # → http://localhost:5173
npm run dev:mobile     # → Expo dev server; press i / a for iOS / Android, or scan the QR code

npm run build:index    # regenerate content/index.json after editing content/register/*.md
```

Without Supabase configured, both apps still run fully for the signed-out
experience (map, search, detail, add-mosque form) — the You screen just
explains sign-in isn't wired up yet instead of showing a broken form.

## What's implemented vs. stubbed

**Fully working, verified (`tsc --noEmit` and a production build both pass
clean for web; `tsc --noEmit` passes clean for mobile):**
- Register parsing (Markdown frontmatter → typed `Mosque` objects), on both
  the build script and the client-side fetch path.
- Distance/walking-time math, staleness rules ("needs a check" past a year
  or unverified), all 8 screens on both platforms, light/dark theming,
  location permission flow, tab navigation.

**Scaffolded, needs finishing for production:**
- `supabase/functions/approve-edit` — the GitHub PR–opening logic is real
  and runnable, but the field-specific frontmatter patch (turning "Jamaat
  timings" into the right YAML edit) is a `TODO`; right now it always
  re-dates `checked`/`checkedBy` correctly but only handles simple value
  swaps.
- Auth is email magic-link only; add OAuth providers in the Supabase dashboard
  if you want them — `useAuth()` doesn't need to change.
- `react-native-maps` needs a Google Maps API key configured per Expo's docs
  for Android; iOS uses Apple Maps by default (swap `PROVIDER_GOOGLE` if you'd
  rather use Apple Maps consistently — see `HomeScreen.tsx`).

## Open questions carried over from the design

See `content/register/README.md` for the full note — in short:
1. **Timings**: stored per mosque (not computed from coordinates). A
   calculated fallback with a jamaat offset is a reasonable v2.
2. **Moderator rights**: granted via the `profiles.is_moderator` column
   here, rather than a `CODEOWNERS` file — easier to manage from the app,
   equally compatible with the register's file layout.
3. **RTL / Urdu / Arabic pass**: not yet done in either app. The `You`
   screen's `language` picker in the original design (English / اردو /
   العربية) is a good anchor point for this — `profiles.language` already
   exists in the schema for it.
