"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { parseCsv } from "@/lib/admin/csv";
import { initialImportState, type ImportState } from "@/lib/admin/import-types";

/**
 * Imports the CSV exactly as exported from the case-comp submissions
 * sheet (same headers as "Case_Comp_C6_-_Final_-_Case_Comp_Enteries.csv") —
 * no reformatting needed before uploading. Matches existing rows by
 * (challenge name, team name) so re-running an import updates rather than
 * duplicates.
 */
const HEADER_MAP: Record<string, string> = {
  "name of the challenge": "challenge",
  "challenge hosted by": "host",
  "your team name": "team",
  "team member 1": "m1",
  "team member 2": "m2",
  "team member 3": "m3",
  "team member 4": "m4",
  position: "position",
  "problem statement": "problem",
  "solution deck": "deck",
  photographs: "photos",
  "cohort": "cohort",
};

const JUNK = new Set(["", "na", "n/a", "not submitted"]);

function clean(v: string | undefined): string | null {
  const t = (v ?? "").trim();
  if (JUNK.has(t.toLowerCase()) || t.toLowerCase().includes("irrelavant") || t.toLowerCase().includes("irrelevant")) {
    return null;
  }
  return t || null;
}

function parsePosition(raw: string | undefined): { rank: number | null; label: string | null } {
  const t = (raw ?? "").trim().toLowerCase().replace("position", "").trim();
  const m = t.match(/^(\d+)/);
  if (!m) return { rank: null, label: clean(raw) };
  const n = Number(m[1]);
  const suffix = n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
  return { rank: n, label: `${n}${suffix} Place` };
}

export async function importEntriesCsv(_prev: ImportState, formData: FormData): Promise<ImportState> {
  await requireAdmin();

  const file = formData.get("file") as File | null;
  if (!file) {
    return { ...initialImportState, status: "error", errors: [{ row: 0, message: "No file uploaded." }] };
  }

  const text = await file.text();
  const rows = parseCsv(text);
  if (rows.length < 2) {
    return { ...initialImportState, status: "error", errors: [{ row: 0, message: "CSV has no data rows." }] };
  }

  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const colIndex: Record<string, number> = {};
  headers.forEach((h, i) => {
    const key = HEADER_MAP[h];
    if (key) colIndex[key] = i;
  });

  if (colIndex["challenge"] === undefined || colIndex["host"] === undefined) {
    return {
      ...initialImportState,
      status: "error",
      errors: [{ row: 0, message: 'CSV must include "Name of the Challenge" and "Challenge hosted by" columns.' }],
    };
  }

  const supabase = getSupabaseAdmin();
  const { data: existingRows } = await supabase.from("case_entries").select("id, challenge_name, team_name");
  const existingByKey = new Map(
    (existingRows ?? []).map((r) => [`${r.challenge_name}|${r.team_name ?? ""}`.toLowerCase(), r.id]),
  );

  let created = 0;
  let updated = 0;
  const skipped: ImportState["skipped"] = [];
  const errors: ImportState["errors"] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const get = (key: string) => (colIndex[key] !== undefined ? row[colIndex[key]] : undefined);

    const challenge = clean(get("challenge"));
    const host = clean(get("host"));
    if (!challenge || !host) {
      skipped.push({ row: i + 1, message: "Missing challenge name or host." });
      continue;
    }

    const team = clean(get("team"));
    const members = [get("m1"), get("m2"), get("m3"), get("m4")].map(clean).filter(Boolean) as string[];
    const { rank, label } = parsePosition(get("position"));

    const fields = {
      challenge_name: challenge,
      host,
      team_name: team,
      members,
      rank,
      position_label: label,
      problem_statement_url: clean(get("problem")),
      solution_deck_url: clean(get("deck")),
      photos_url: clean(get("photos")),
      cohort: clean(get("cohort")) ?? "C6",
      featured: false,
    };

    const key = `${challenge}|${team ?? ""}`.toLowerCase();
    const existingId = existingByKey.get(key);

    try {
      if (existingId) {
        const { error } = await supabase.from("case_entries").update(fields).eq("id", existingId);
        if (error) throw error;
        updated++;
      } else {
        const { error } = await supabase.from("case_entries").insert(fields);
        if (error) throw error;
        created++;
      }
    } catch (e) {
      errors.push({ row: i + 1, name: challenge, message: e instanceof Error ? e.message : "Unknown error" });
    }
  }

  return { status: "done", totalRows: rows.length - 1, created, updated, skipped, errors };
}
