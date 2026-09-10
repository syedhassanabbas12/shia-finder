-- Mihrab — Supabase schema.
-- The mosque register itself is NOT in this database — it lives as public
-- Markdown in GitHub (see /content/register). This schema only covers the
-- account-gated layer: who you are, what you've saved, what you've visited,
-- edits you've proposed, and who can moderate.

create extension if not exists "uuid-ossp";

-- One row per authenticated user, created on first sign-in (see trigger below).
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique not null,
  language text not null default 'English' check (language in ('English', 'اردو', 'العربية')),
  is_moderator boolean not null default false,
  moderator_area text,
  edits_merged integer not null default 0,
  created_at timestamptz not null default now()
);

create table favorites (
  profile_id uuid not null references profiles(id) on delete cascade,
  mosque_id text not null, -- matches Mosque.id from content/index.json
  created_at timestamptz not null default now(),
  primary key (profile_id, mosque_id)
);

create table visits (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  mosque_id text not null,
  what text not null, -- e.g. "Maghrib jamaat", "Friday khutba"
  occurred_at timestamptz not null default now()
);

create table edit_suggestions (
  id uuid primary key default uuid_generate_v4(),
  mosque_id text not null,
  field text not null check (field in ('times', 'address', 'phone', 'langs', 'facilities')),
  from_value text not null,
  to_value text not null,
  source text not null default '',
  submitted_by uuid not null references profiles(id),
  submitted_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  resolved_by uuid references profiles(id),
  resolved_at timestamptz,
  -- set by the approve-edit Edge Function once the PR is opened/merged
  github_pr_url text
);

-- Auto-create a profile row (with a placeholder handle) on first sign-in.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, handle)
  values (new.id, '@' || split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row-level security ----------------------------------------------------
-- Reading mosque data needs no login at all (it isn't even in this
-- database). Everything below is the user's own personal state, or the
-- moderator queue, which is why RLS is strict here.

alter table profiles enable row level security;
alter table favorites enable row level security;
alter table visits enable row level security;
alter table edit_suggestions enable row level security;

create policy "profiles are self-readable" on profiles
  for select using (auth.uid() = id);
create policy "profiles are self-updatable" on profiles
  for update using (auth.uid() = id);

create policy "favorites are private to the owner" on favorites
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "visits are private to the owner" on visits
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- Anyone signed in can propose an edit and see their own; moderators can
-- see (and, via the Edge Function using the service role, resolve) all of them.
create policy "users can submit edits" on edit_suggestions
  for insert with check (auth.uid() = submitted_by);
create policy "users can see their own suggestions" on edit_suggestions
  for select using (auth.uid() = submitted_by);
create policy "moderators can see the full queue" on edit_suggestions
  for select using (exists (
    select 1 from profiles where profiles.id = auth.uid() and profiles.is_moderator
  ));
