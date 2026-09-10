# The register

This folder is the whole database: one Markdown file per mosque, readable by
anyone, editable by pull request. No login is needed to browse it — the app
reads these files (and the generated `index.json`) straight from GitHub over
HTTPS.

## Adding a mosque

1. Copy an existing file as a template.
2. Slug the filename from the name: `Idara-e-Jaaferiya` → `idara-e-jaaferiya.md`.
3. Fill in the frontmatter (see schema below). Leave a field as `"—"` if unknown
   — don't guess.
4. Open a pull request. Two moderators need to confirm a **new** mosque before
   it appears on the map; one moderator confirming an **edit** to an existing
   one is enough.

## Frontmatter schema

| Field         | Type                                   | Notes |
|---------------|-----------------------------------------|-------|
| `id`          | string                                  | Short, stable, lowercase. Never changes once merged — the app and Supabase favourites/visit tables key on it. |
| `name`        | string                                  | As the community says it. |
| `school`      | `Ithna Ashari` \| `Ismaili` \| `Bohra`   | |
| `area`        | string                                  | Neighbourhood/district, used for search grouping. |
| `address`     | string                                  | |
| `coordinates` | `{ lat, lng }`                          | Place the pin on the door, not the car park. |
| `languages`   | string[]                                | Language(s) of the khutba/majlis. |
| `phone`       | string                                  | `"—"` if none. |
| `website`     | string                                  | `"—"` if none. |
| `facilities`  | string[]                                | Free text tags, e.g. `Women's section`, `Wudhu`, `Parking`, `Step-free`, `Library`. |
| `verified`    | boolean                                 | Set by a moderator on confirmation, not by the submitter. |
| `checked`     | date (`YYYY-MM-DD`)                     | Last moderator confirmation date. A record older than a year is treated as stale in the app regardless of this flag. |
| `checkedBy`   | string                                  | Moderator handle. |
| `addedBy`     | string                                  | Original submitter handle. |
| `jamaat`      | per-prayer `{ adhan, jamaat }`          | Stored values, not computed — see "Open questions" in the design notes. `"—"` where not applicable (e.g. Jamatkhana). |
| `timesNote`   | string                                  | Free text — how/when timings were last confirmed. |
| `event`       | string                                  | "What's on" — current programme. |

The Markdown body below the frontmatter is the community notes shown on the
record ("ask at the office for the side gate…"), signed with who added it.

## How an edit becomes a merged fact

1. A signed-in user suggests an edit in the app (Supabase `edit_suggestions`
   table — see `/supabase/schema.sql`).
2. It shows as **pending** on the record immediately, credited to them.
3. A moderator confirms it in the app's review queue.
4. Confirming triggers a pull request against the relevant `.md` file here
   (see `/supabase/functions/approve-edit`), with the moderator's handle and
   today's date written into `checkedBy` / `checked`.
5. Once merged, `content/scripts/build-index.mjs` regenerates `index.json` (run
   in CI on every push to this folder) and the app picks up the new facts on
   its next fetch.

## Still open (carried over from the design)

- **Timings**: currently stored per mosque, not computed from coordinates —
  see `jamaat` above. A calculated fallback (with a jamaat offset) is a
  reasonable v2 if a mosque hasn't posted its own times.
- **Moderator rights**: this scaffold grants them via a `moderators` table in
  Supabase (see `/supabase/schema.sql`) rather than a `CODEOWNERS` file, so
  they can be managed in-app; either is compatible with this folder structure.
- **RTL / Urdu / Arabic pass**: not yet done in either app.
