"use client";

import { SubmitButton } from "./SubmitButton";
import type { EntryRecord } from "@/lib/admin/data";

export function EntryForm({
  entry,
  action,
}: {
  entry?: EntryRecord;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <Field label="Challenge name" name="challenge_name" defaultValue={entry?.challenge_name} required />
      <Field label="Hosted by" name="host" defaultValue={entry?.host} required />
      <Field label="Team name" name="team_name" defaultValue={entry?.team_name ?? ""} />
      <Textarea
        label="Team members (one per line)"
        name="members"
        defaultValue={entry?.members?.join("\n") ?? ""}
      />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Rank (number, blank if none)" name="rank" type="number" defaultValue={entry?.rank ?? ""} />
        <Field label="Position label (e.g. 1st Place)" name="position_label" defaultValue={entry?.position_label ?? ""} />
      </div>
      <Field label="Solution deck URL" name="solution_deck_url" defaultValue={entry?.solution_deck_url ?? ""} />
      <Field label="Photos URL" name="photos_url" defaultValue={entry?.photos_url ?? ""} />
      <Field label="Cohort" name="cohort" defaultValue={entry?.cohort ?? "C6"} />
      <label className="flex items-center gap-2.5 text-sm text-ink">
        <input type="checkbox" name="featured" defaultChecked={entry?.featured} className="mu-checkbox" />
        Featured
      </label>
      <SubmitButton className="self-start" pendingLabel="Saving…">Save</SubmitButton>
    </form>
  );
}

function Field({
  label, name, defaultValue, required, type = "text",
}: { label: string; name: string; defaultValue?: string | number | null; required?: boolean; type?: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-ink">
      {label}
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="border border-hairline bg-panel px-3 py-2.5 text-[15px] text-ink placeholder:text-ink-faint focus:border-brass focus:outline-none"
      />
    </label>
  );
}

function Textarea({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-ink">
      {label}
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={3}
        className="border border-hairline bg-panel px-3 py-2.5 text-[15px] text-ink placeholder:text-ink-faint focus:border-brass focus:outline-none"
      />
    </label>
  );
}
