import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { OpportunityStatus } from "@/lib/types";

export interface EntryRecord {
  id: string;
  challenge_name: string;
  host: string;
  team_name: string | null;
  members: string[];
  rank: number | null;
  position_label: string | null;
  solution_deck_url: string | null;
  photos_url: string | null;
  cohort: string;
  featured: boolean;
  created_at: string;
}

export interface OpportunityRecord {
  id: string;
  name: string;
  host: string;
  eligibility: string | null;
  deadline: string | null;
  apply_url: string | null;
  prize: string | null;
  status: OpportunityStatus;
  notes: string | null;
  created_at: string;
}

// ── Entries ────────────────────────────────────────────────────────────
export async function listEntriesForAdmin(): Promise<EntryRecord[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("case_entries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getEntryForAdmin(id: string): Promise<EntryRecord | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("case_entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function createEntry(fields: Omit<EntryRecord, "id" | "created_at">) {
  const { error } = await getSupabaseAdmin().from("case_entries").insert(fields);
  if (error) throw new Error(error.message);
}

export async function updateEntry(id: string, fields: Partial<Omit<EntryRecord, "id" | "created_at">>) {
  const { error } = await getSupabaseAdmin().from("case_entries").update(fields).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteEntry(id: string) {
  const { error } = await getSupabaseAdmin().from("case_entries").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ── Opportunities ─────────────────────────────────────────────────────
export async function listOpportunitiesForAdmin(): Promise<OpportunityRecord[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("case_opportunities")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getOpportunityForAdmin(id: string): Promise<OpportunityRecord | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("case_opportunities")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function createOpportunity(fields: Omit<OpportunityRecord, "id" | "created_at">) {
  const { error } = await getSupabaseAdmin().from("case_opportunities").insert(fields);
  if (error) throw new Error(error.message);
}

export async function updateOpportunity(id: string, fields: Partial<Omit<OpportunityRecord, "id" | "created_at">>) {
  const { error } = await getSupabaseAdmin().from("case_opportunities").update(fields).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteOpportunity(id: string) {
  const { error } = await getSupabaseAdmin().from("case_opportunities").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
