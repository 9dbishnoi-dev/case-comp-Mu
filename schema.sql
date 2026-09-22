-- Run once in the Supabase SQL editor. Adds two new tables to the SAME
-- Supabase project the founders app already uses — no new project needed.
-- Namespaced with a case_ prefix so nothing collides with startups/founders.

-- ── Past results (what MU teams have entered/won) ──────────────────────
create table if not exists case_entries (
  id uuid primary key default gen_random_uuid(),
  challenge_name text not null,
  host text not null,
  team_name text,
  members text[] not null default '{}',
  rank int,                    -- 1, 2, 3... null if not placed/unknown
  position_label text,         -- "1st Place", "Finalist", etc — display label
  problem_statement_url text,
  solution_deck_url text,
  photos_url text,
  cohort text not null default 'C6',
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── Upcoming opportunities (open for students to apply to) ─────────────
create table if not exists case_opportunities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  host text not null,
  eligibility text,
  deadline date,
  apply_url text,
  prize text,
  status text not null default 'Open'
    check (status in ('Open', 'Closing soon', 'Closed')),
  notes text,
  created_at timestamptz not null default now()
);

alter table case_entries enable row level security;
alter table case_opportunities enable row level security;

-- Public read on both — same pattern as startups/founders. No insert/
-- update/delete policies for anon/authenticated: all admin writes go
-- through the service-role client (src/lib/supabase/admin.ts), which
-- bypasses RLS entirely, exactly like the founders app.
create policy "case_entries are publicly readable"
  on case_entries for select using (true);

create policy "case_opportunities are publicly readable"
  on case_opportunities for select using (true);

create index if not exists case_entries_rank_idx on case_entries (rank);
create index if not exists case_opportunities_deadline_idx on case_opportunities (deadline);
