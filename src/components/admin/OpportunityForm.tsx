"use client";

import { SubmitButton } from "./SubmitButton";
import type { OpportunityRecord } from "@/lib/admin/data";

const STATUSES = ["Open", "Closing soon", "Closed"];

export function OpportunityForm({
  opportunity,
  action,
}: {
  opportunity?: OpportunityRecord;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <Field label="Competition name" name="name" defaultValue={opportunity?.name} required />
      <Field label="Hosted by" name="host" defaultValue={opportunity?.host} required />
      <Textarea label="Eligibility" name="eligibility" defaultValue={opportunity?.eligibility ?? ""} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Application deadline" name="deadline" type="date" defaultValue={opportunity?.deadline ?? ""} />
        <label className="flex flex-col gap-1.5 text-sm text-ink">
          Status
          <select
            name="status"
            defaultValue={opportunity?.status ?? "Open"}
            className="border border-hairline bg-panel px-3 py-2.5 text-[15px] text-ink focus:border-brass focus:outline-none"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>
      <Field label="Apply URL" name="apply_url" defaultValue={opportunity?.apply_url ?? ""} />
      <Field label="Prize" name="prize" defaultValue={opportunity?.prize ?? ""} />
      <Textarea label="Notes (internal)" name="notes" defaultValue={opportunity?.notes ?? ""} />
      <SubmitButton className="self-start" pendingLabel="Saving…">Save</SubmitButton>
    </form>
  );
}

function Field({
  label, name, defaultValue, required, type = "text",
}: { label: string; name: string; defaultValue?: string | null; required?: boolean; type?: string }) {
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
