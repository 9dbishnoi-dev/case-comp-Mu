-- Run once in the Supabase SQL editor.
-- Adds a table describing each *competition* (not each entry) — one row per
-- unique challenge, with a blurb and a link to its official page. Entries
-- join to this by (challenge_name, host).

create table if not exists case_competitions (
  id uuid primary key default gen_random_uuid(),
  challenge_name text not null,
  host text not null,
  about_url text,          -- official page / Unstop listing / fest page
  description text,        -- 1-3 sentence summary of what the comp is
  created_at timestamptz not null default now(),
  unique (challenge_name, host)
);

alter table case_competitions enable row level security;

create policy "case_competitions are publicly readable"
  on case_competitions for select using (true);

create index if not exists case_competitions_name_idx
  on case_competitions (challenge_name, host);
