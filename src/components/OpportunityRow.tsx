import type { CaseOpportunity } from "@/lib/types";
import { OpportunityStatusPill } from "./OpportunityStatusPill";

function formatDeadline(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function OpportunityRow({ opportunity }: { opportunity: CaseOpportunity }) {
  const deadline = formatDeadline(opportunity.deadline);

  return (
    <div className="border-b border-hairline px-3 py-5 sm:px-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-display text-lg text-ink">{opportunity.name}</h3>
        <OpportunityStatusPill status={opportunity.status} />
      </div>

      <p className="mt-1 text-[15px] leading-snug text-ink-soft">
        Hosted by {opportunity.host}
      </p>

      {opportunity.eligibility && (
        <p className="mt-3 text-sm text-ink">
          <span className="text-ink-faint">Eligibility </span>
          {opportunity.eligibility}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        {opportunity.prize && (
          <span className="border border-hairline px-2 py-0.5 text-xs text-ink-soft">
            {opportunity.prize}
          </span>
        )}
        {deadline && (
          <span className="text-xs text-ink-faint">Apply by {deadline}</span>
        )}
        {opportunity.applyUrl && opportunity.status !== "Closed" && (
          <a
            href={opportunity.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1 bg-teal px-3 py-1.5 text-xs font-semibold text-paper transition-colors hover:bg-teal/90"
          >
            Apply now ↗
          </a>
        )}
      </div>
    </div>
  );
}
