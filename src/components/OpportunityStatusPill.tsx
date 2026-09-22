import type { OpportunityStatus } from "@/lib/types";

const STYLES: Record<OpportunityStatus, string> = {
  Open: "border-teal/40 text-teal",
  "Closing soon": "border-brass-deep/50 text-brass-deep",
  Closed: "border-ink-soft/40 text-ink-soft",
};

export function OpportunityStatusPill({ status }: { status: OpportunityStatus }) {
  return (
    <span className={`inline-flex items-center border px-2 py-0.5 text-xs ${STYLES[status]}`}>
      {status}
    </span>
  );
}
