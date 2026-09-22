# Case Competitions — Masters' Union

Tracks case competitions MU students have entered and won, plus upcoming
competitions students are still eligible to apply to. Sister project to
The Founders' Register — same look and feel, deliberately different accent
color (teal) and CTAs so the two never get confused, and lives in its own
repo/deploy so it can't break the startups site.

## Stack

- Next.js (App Router) + TypeScript + Tailwind — same as the founders app
- **Same Supabase project as the founders app** — just two new tables
  (`case_entries`, `case_opportunities`), namespaced with a `case_` prefix.
  No new Supabase project needed.

## One-time setup

### 1. Add the tables to your existing Supabase project

Open your existing Supabase project (the one the founders app already
uses) → SQL Editor → paste in and run **`schema.sql`** from this repo.
That creates `case_entries` and `case_opportunities` with public-read RLS
policies, same pattern as `startups`/`founders`.

### 2. Env vars

Copy `.env.local.example` to `.env.local` and fill in the **same three
values** you're already using for the founders app (same Supabase project
→ same URL/keys):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

On Vercel: Project Settings → Environment Variables, same three.

### 3. Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. Nothing will show up yet — see below.

### 4. Import the C6 data

Sign in at `/admin` (same Supabase Auth users as the founders app — anyone
who already has a login there can sign in here too, since it's the same
Supabase project). Go to **Entries → Import CSV** and upload
`case-comp-c6-import.csv` (included in this repo — it's your original C6
export, no reformatting needed). Positions like "1st ", "2ND", bare "3"
etc. are normalized automatically into a clean rank + label.

Re-uploading a later export updates existing rows (matched by challenge +
team name) instead of duplicating them — safe to re-run as your sheet
grows.

### 5. Add upcoming opportunities

Admin → **Opportunities → Add opportunity**. These are the ones students
can still apply to — name, host, eligibility, deadline, apply link, prize,
status (Open / Closing soon / Closed). No CSV for these yet since you'll
likely add them one at a time as you find them; ask me to add a CSV
importer for this table too if you end up wanting to bulk-add.

## Where the data lives

- `case_entries` — past results. Public read-only fields: challenge name,
  host, team name, members, rank/position, links to the problem statement
  and solution deck, photos, cohort. **Contact numbers from the original
  CSV are intentionally not stored** — that's PII and has no reason to be
  on a public site; re-check with the submission owner if you ever need to
  reach a team.
- `case_opportunities` — upcoming/open competitions, admin-managed.

## Deploying

Same as the founders app:

1. Push this repo to its own GitHub repo (don't merge it into the founders
   repo).
2. Vercel → Import Project → point at this repo → Deploy.
3. Add the three env vars under Settings → Environment Variables.
4. Optional: custom subdomain, e.g. `cases.mastersunion.org`.

## Project structure

```
schema.sql                    run once in Supabase SQL editor
case-comp-c6-import.csv       your cleaned C6 data, ready to import via admin
src/
  app/
    page.tsx                  homepage — Wins / Open now tabs
    admin/
      page.tsx                admin hub
      entries/                 CRUD + CSV import for past results
      opportunities/            CRUD for upcoming/open competitions
      login/                   same Supabase-Auth login as founders app
  components/
    Board.tsx                 search + filter + tabs, the interactive part
    EntryRow.tsx / OpportunityRow.tsx   one row of each type
    RankBadge.tsx              #1/#2/#3 medal-style badge
    OpportunityStatusPill.tsx  Open / Closing soon / Closed badge
  lib/
    types.ts                  CaseEntry / CaseOpportunity types
    data.ts                   public Supabase reads
    admin/data.ts              admin CRUD (service-role client)
```
