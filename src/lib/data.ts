import { createClient } from "@supabase/supabase-js";
import type { CaseEntry, CaseOpportunity, CaseCompetition } from "./types";

/**
 * Public read-only Supabase client (anon key). case_entries/case_opportunities
 * both have an open "select using (true)" RLS policy — no session needed.
 * This points at the SAME Supabase project as the founders app; the tables
 * are just namespaced with a case_ prefix.
 */
function getSupabasePublic() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function getEntries(): Promise<CaseEntry[]> {
  const supabase = getSupabasePublic();
  const { data, error } = await supabase
    .from("case_entries")
    .select("*")
    .order("rank", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load case_entries from Supabase:", error.message);
    return [];
  }

  return (data ?? []).map((row): CaseEntry => ({
    id: row.id,
    challengeName: row.challenge_name,
    host: row.host,
    teamName: row.team_name,
    members: row.members ?? [],
    rank: row.rank,
    positionLabel: row.position_label,
    solutionDeckUrl: row.solution_deck_url,
    photosUrl: row.photos_url,
    cohort: row.cohort,
    featured: row.featured,
  }));
}

export async function getOpportunities(): Promise<CaseOpportunity[]> {
  const supabase = getSupabasePublic();
  const { data, error } = await supabase
    .from("case_opportunities")
    .select("*")
    .order("deadline", { ascending: true, nullsFirst: false });

  if (error) {
    console.error("Failed to load case_opportunities from Supabase:", error.message);
    return [];
  }

  return (data ?? []).map((row): CaseOpportunity => ({
    id: row.id,
    name: row.name,
    host: row.host,
    eligibility: row.eligibility,
    deadline: row.deadline,
    applyUrl: row.apply_url,
    prize: row.prize,
    status: row.status,
    notes: row.notes,
  }));
}

export async function getCompetitions(): Promise<CaseCompetition[]> {
  const supabase = getSupabasePublic();
  const { data, error } = await supabase
    .from("case_competitions")
    .select("*")
    .order("challenge_name", { ascending: true });

  if (error) {
    console.error("Failed to load case_competitions from Supabase:", error.message);
    return [];
  }

  return (data ?? []).map((row): CaseCompetition => ({
    id: row.id,
    challengeName: row.challenge_name,
    host: row.host,
    aboutUrl: row.about_url,
    description: row.description,
  }));
}

export async function getCompetitionByName(
  challengeName: string,
  host: string,
): Promise<CaseCompetition | null> {
  const supabase = getSupabasePublic();
  const { data, error } = await supabase
    .from("case_competitions")
    .select("*")
    .eq("challenge_name", challengeName)
    .eq("host", host)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    challengeName: data.challenge_name,
    host: data.host,
    aboutUrl: data.about_url,
    description: data.description,
  };
}
