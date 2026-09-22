import type { CaseEntry } from "@/lib/types";
import { RankBadge } from "./RankBadge";

export function EntryRow({ entry }: { entry: CaseEntry }) {
  const links = [
    { label: "Problem statement", href: entry.problemStatementUrl },
    { label: "Solution deck", href: entry.solutionDeckUrl },
    { label: "Photos", href: entry.photosUrl },
  ].filter((l) => l.href);

  return (
    <div
      className={`border-b border-hairline px-3 py-5 sm:px-4 ${
        entry.featured ? "border-l-2 border-l-brass bg-brass/[0.04]" : ""
      }`}
    >
      <div className="flex gap-4">
        <RankBadge rank={entry.rank} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-display text-lg text-ink">{entry.challengeName}</h3>
            {entry.positionLabel && (
              <span className="inline-flex items-center border border-brass/50 px-2 py-0.5 text-xs font-medium text-brass">
                {entry.positionLabel}
              </span>
            )}
          </div>

          <p className="mt-1 text-[15px] leading-snug text-ink-soft">
            Hosted by {entry.host}
          </p>

          {entry.members.length > 0 && (
            <p className="mt-3 text-sm text-ink">
              <span className="text-ink-faint">
                {entry.teamName ? `${entry.teamName} · ` : ""}
                {entry.members.length === 1 ? "Member " : "Team "}
              </span>
              {entry.members.join(", ")}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-3">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-teal underline decoration-teal/40 underline-offset-4 hover:decoration-teal"
              >
                {l.label} ↗
              </a>
            ))}
            <span className="ml-auto text-xs text-ink-faint">{entry.cohort}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
