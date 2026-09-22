"use client";

import { useMemo, useState } from "react";
import type { CaseEntry, CaseOpportunity } from "@/lib/types";
import { FilterGroup } from "./FilterGroup";
import { EntryRow } from "./EntryRow";
import { OpportunityRow } from "./OpportunityRow";

type Tab = "wins" | "open";

function toggle(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export function Board({
  entries,
  opportunities,
  competitionIdByKey = {},
}: {
  entries: CaseEntry[];
  opportunities: CaseOpportunity[];
  competitionIdByKey?: Record<string, string>;
}) {
  const [tab, setTab] = useState<Tab>("wins");
  const [query, setQuery] = useState("");
  const [hosts, setHosts] = useState<Set<string>>(new Set());
  const [positions, setPositions] = useState<Set<string>>(new Set());
  const [statuses, setStatuses] = useState<Set<string>>(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);

  const hostOptions = useMemo(
    () => Array.from(new Set(entries.map((e) => e.host))).sort(),
    [entries],
  );
  const positionOptions = useMemo(
    () =>
      Array.from(new Set(entries.map((e) => e.positionLabel).filter(Boolean))) as string[],
    [entries],
  );
  const statusOptions = ["Open", "Closing soon", "Closed"];

  const filteredEntries = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries
      .filter((e) => {
        if (hosts.size > 0 && !hosts.has(e.host)) return false;
        if (positions.size > 0 && (!e.positionLabel || !positions.has(e.positionLabel)))
          return false;
        if (!q) return true;
        const haystack = `${e.challengeName} ${e.host} ${e.members.join(" ")} ${e.teamName ?? ""}`.toLowerCase();
        return haystack.includes(q);
      })
      .sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return (a.rank ?? 99) - (b.rank ?? 99);
      });
  }, [entries, query, hosts, positions]);

  const filteredOpportunities = useMemo(() => {
    const q = query.trim().toLowerCase();
    return opportunities.filter((o) => {
      if (statuses.size > 0 && !statuses.has(o.status)) return false;
      if (!q) return true;
      const haystack = `${o.name} ${o.host} ${o.eligibility ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [opportunities, query, statuses]);

  const activeFilterCount =
    tab === "wins" ? hosts.size + positions.size : statuses.size;

  function clearFilters() {
    setHosts(new Set());
    setPositions(new Set());
    setStatuses(new Set());
    setQuery("");
  }

  const filterPanel =
    tab === "wins" ? (
      <div className="flex flex-col gap-8">
        <FilterGroup label="Host" options={hostOptions} selected={hosts} onToggle={(v) => setHosts((s) => toggle(s, v))} />
        <FilterGroup label="Result" options={positionOptions} selected={positions} onToggle={(v) => setPositions((s) => toggle(s, v))} />
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="self-start text-sm text-brass-deep underline decoration-brass-deep/40 underline-offset-4 hover:decoration-brass-deep">
            Clear filters
          </button>
        )}
      </div>
    ) : (
      <div className="flex flex-col gap-8">
        <FilterGroup label="Status" options={statusOptions} selected={statuses} onToggle={(v) => setStatuses((s) => toggle(s, v))} />
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="self-start text-sm text-brass-deep underline decoration-brass-deep/40 underline-offset-4 hover:decoration-brass-deep">
            Clear filters
          </button>
        )}
      </div>
    );

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-5 pb-16 md:grid-cols-[220px_1fr] md:gap-10 md:px-8 md:pb-24">
      <aside className="hidden md:block md:sticky md:top-20 md:self-start">
        {filterPanel}
      </aside>

      <div>
        {/* Tabs */}
        <div className="mb-6 flex gap-1 border-b border-hairline">
          {(
            [
              { key: "wins", label: `Wins (${entries.length})` },
              { key: "open", label: `Open now (${opportunities.length})` },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                tab === t.key
                  ? "border-b-2 border-brass-deep text-ink"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-3 border-b border-hairline pb-6">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tab === "wins" ? "Search by challenge, host or team" : "Search by name or host"}
              className="w-full flex-1 border border-hairline bg-panel px-3 py-2.5 text-[15px] text-ink placeholder:text-ink-faint transition-colors focus:border-brass focus:outline-none"
            />
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex shrink-0 items-center gap-1.5 border border-hairline bg-panel px-3 py-2.5 text-sm text-ink transition-colors hover:border-ink-faint md:hidden"
            >
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brass px-1 text-xs font-semibold text-paper">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
          <p className="text-sm text-ink-soft">
            {tab === "wins"
              ? `${filteredEntries.length} of ${entries.length} entries`
              : `${filteredOpportunities.length} of ${opportunities.length} opportunities`}
          </p>
        </div>

        {tab === "wins" ? (
          filteredEntries.length === 0 ? (
            <EmptyState label="entries" />
          ) : (
            <div className="mu-fade-up">
              {filteredEntries.map((e) => (
                <EntryRow
                  key={e.id}
                  entry={e}
                  competitionId={competitionIdByKey[`${e.challengeName.toLowerCase()}|${e.host.toLowerCase()}`]}
                />
              ))}
            </div>
          )
        ) : filteredOpportunities.length === 0 ? (
          <EmptyState label="opportunities" />
        ) : (
          <div className="mu-fade-up">
            {filteredOpportunities.map((o) => (
              <OpportunityRow key={o.id} opportunity={o} />
            ))}
          </div>
        )}
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-hairline bg-paper px-5 pb-8 pt-4">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-hairline" />
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg text-ink">Filters</h2>
              <button onClick={() => setFiltersOpen(false)} className="text-sm text-ink-soft">
                Done
              </button>
            </div>
            {filterPanel}
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="border border-dashed border-hairline px-6 py-16 text-center">
      <p className="font-display text-lg text-ink">No {label} match these filters.</p>
      <p className="mt-2 text-sm text-ink-soft">Try clearing a filter or searching a different term.</p>
    </div>
  );
}
