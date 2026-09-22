import Link from "next/link";
import { listEntriesForAdmin } from "@/lib/admin/data";
import { deleteEntryAction } from "../actions";
import { MuLogo } from "@/components/MuLogo";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { logoutAction } from "../login/actions";

export const metadata = { title: "Entries — Admin", robots: "noindex" };

export default async function AdminEntriesPage() {
  const entries = await listEntriesForAdmin();

  return (
    <main className="flex-1">
      <header className="sticky top-0 z-30 border-b border-hairline bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/"><MuLogo /></Link>
          <form action={logoutAction}>
            <SubmitButton variant="link" pendingLabel="Signing out…">Sign out</SubmitButton>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-14 md:px-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl text-ink">Entries &amp; results</h1>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm text-ink-soft hover:text-ink">← Admin home</Link>
            <Link href="/admin/import" className="border border-hairline px-4 py-2 text-sm text-ink-soft transition-colors hover:border-brass-deep hover:text-ink">
              Import CSV
            </Link>
            <Link href="/admin/entries/new" className="bg-brass px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-brass/90">
              Add entry
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col divide-y divide-hairline border-t border-hairline">
          {entries.length === 0 && (
            <p className="py-8 text-sm text-ink-soft">No entries yet — add one or import the CSV.</p>
          )}
          {entries.map((e) => (
            <div key={e.id} className="flex items-center justify-between gap-4 py-4">
              <Link href={`/admin/entries/${e.id}`} className="min-w-0 flex-1 hover:opacity-80">
                <p className="truncate text-ink">{e.challenge_name}</p>
                <p className="mt-0.5 text-sm text-ink-soft">
                  {e.host} · {e.position_label ?? "No result recorded"} · {e.cohort}
                </p>
              </Link>
              <form action={deleteEntryAction.bind(null, e.id)}>
                <SubmitButton variant="danger" pendingLabel="Deleting…">Delete</SubmitButton>
              </form>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
