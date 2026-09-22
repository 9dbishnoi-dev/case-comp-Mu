"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import {
  createEntry,
  updateEntry,
  deleteEntry,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} from "@/lib/admin/data";
import type { OpportunityStatus } from "@/lib/types";

function str(formData: FormData, key: string): string | null {
  const v = String(formData.get(key) ?? "").trim();
  return v || null;
}

function splitLines(v: string | null): string[] {
  if (!v) return [];
  return v.split(/\n|;/).map((s) => s.trim()).filter(Boolean);
}

// ── Entries ────────────────────────────────────────────────────────────
export async function saveEntryAction(id: string | null, formData: FormData) {
  await requireAdmin();

  const rank = str(formData, "rank");
  const fields = {
    challenge_name: str(formData, "challenge_name") ?? "",
    host: str(formData, "host") ?? "",
    team_name: str(formData, "team_name"),
    members: splitLines(str(formData, "members")),
    rank: rank ? Number(rank) : null,
    position_label: str(formData, "position_label"),
    solution_deck_url: str(formData, "solution_deck_url"),
    photos_url: str(formData, "photos_url"),
    cohort: str(formData, "cohort") ?? "C6",
    featured: formData.get("featured") === "on",
  };

  if (id) await updateEntry(id, fields);
  else await createEntry(fields);

  revalidatePath("/admin/entries");
  revalidatePath("/");
  redirect("/admin/entries");
}

export async function deleteEntryAction(id: string) {
  await requireAdmin();
  await deleteEntry(id);
  revalidatePath("/admin/entries");
  revalidatePath("/");
}

// ── Opportunities ─────────────────────────────────────────────────────
export async function saveOpportunityAction(id: string | null, formData: FormData) {
  await requireAdmin();

  const fields = {
    name: str(formData, "name") ?? "",
    host: str(formData, "host") ?? "",
    eligibility: str(formData, "eligibility"),
    deadline: str(formData, "deadline"),
    apply_url: str(formData, "apply_url"),
    prize: str(formData, "prize"),
    status: (str(formData, "status") ?? "Open") as OpportunityStatus,
    notes: str(formData, "notes"),
  };

  if (id) await updateOpportunity(id, fields);
  else await createOpportunity(fields);

  revalidatePath("/admin/opportunities");
  revalidatePath("/");
  redirect("/admin/opportunities");
}

export async function deleteOpportunityAction(id: string) {
  await requireAdmin();
  await deleteOpportunity(id);
  revalidatePath("/admin/opportunities");
  revalidatePath("/");
}
