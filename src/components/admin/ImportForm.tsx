"use client";

import Link from "next/link";
import { useActionState } from "react";
import { importEntriesCsv } from "@/app/admin/import/actions";
import { initialImportState } from "@/lib/admin/import-types";

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-hairline px-4 py-3">
      <p className="text-2xl text-ink">{value}</p>
      <p className="mt-0.5 text-xs text-ink-soft">{label}</p>
    </div>
  );
}

export function ImportForm() {
  const [state, formAction, isPending] = useActionState(importEntriesCsv, initialImportState);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-6 py-14 md:px-8">
        <Link href="/admin/entries" className="text-sm text-ink-soft underline decoration-hairline underline-offset-4 hover:text-ink hover:decoration-brass-deep">
          Back to entries
        </Link>

        <h1 className="mt-4 font-display text-2xl text-ink">Import CSV</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Upload the case-comp submissions export as-is — same columns as
          &ldquo;Name of the Challenge&rdquo;, &ldquo;Challenge hosted
          by&rdquo;, &ldquo;Your Team Name&rdquo;, &ldquo;Team Member
          1&ndash;4&rdquo;, &ldquo;Position&rdquo;, &ldquo;Problem
          statement&rdquo;, &ldquo;Solution Deck&rdquo;,
          &ldquo;Photographs&rdquo;. Rows are matched by challenge + team
          name, so re-importing an updated sheet updates existing rows
          instead of duplicating them.
        </p>

        <form action={formAction} className="mt-8 flex flex-col gap-4">
          <input
            type="file"
            name="file"
            accept=".csv,text/csv"
            required
            className="border border-hairline bg-panel px-3 py-2.5 text-[15px] text-ink file:mr-4 file:border-0 file:bg-brass file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-paper"
          />
          <button
            type="submit"
            disabled={isPending}
            className="self-start bg-brass px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-brass/90 disabled:opacity-60"
          >
            {isPending ? "Importing…" : "Import"}
          </button>
        </form>

        {state.status === "done" && (
          <div className="mt-10 flex flex-col gap-6 border-t border-hairline pt-8">
            <div className="grid grid-cols-3 gap-3">
              <Stat label="created" value={state.created} />
              <Stat label="updated" value={state.updated} />
              <Stat label="total rows" value={state.totalRows} />
            </div>

            {state.skipped.length > 0 && (
              <div>
                <p className="text-sm text-ink-soft">Rows skipped ({state.skipped.length})</p>
                <ul className="mt-2 flex flex-col gap-1">
                  {state.skipped.map((s, i) => (
                    <li key={i} className="text-sm text-brass-deep">Row {s.row}: {s.message}</li>
                  ))}
                </ul>
              </div>
            )}

            {state.errors.length > 0 && (
              <div>
                <p className="text-sm text-ink-soft">Errors ({state.errors.length})</p>
                <ul className="mt-2 flex flex-col gap-1">
                  {state.errors.map((e, i) => (
                    <li key={i} className="text-sm text-rust">
                      Row {e.row}{e.name ? ` ("${e.name}")` : ""}: {e.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {state.errors.length === 0 && state.skipped.length === 0 && (
              <p className="text-sm text-teal">Every row imported cleanly.</p>
            )}
          </div>
        )}

        {state.status === "error" && (
          <div className="mt-10 border-t border-hairline pt-8">
            <p className="text-sm text-rust">{state.errors[0]?.message}</p>
          </div>
        )}
      </div>
    </main>
  );
}
