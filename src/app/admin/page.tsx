import Link from "next/link";
import { listEntriesForAdmin, listOpportunitiesForAdmin } from "@/lib/admin/data";
import { logoutAction } from "./login/actions";
import { MuLogo } from "@/components/MuLogo";
import { SubmitButton } from "@/components/admin/SubmitButton";

export const metadata = { title: "Admin — Case Competitions", robots: "noindex" };

export default async function AdminPage() {
  const [entries, opportunities] = await Promise.all([
    listEntriesForAdmin(),
    listOpportunitiesForAdmin(),
  ]);
  const openCount = opportunities.filter((o) => o.status !== "Closed").length;

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
        <h1 className="font-display text-2xl text-ink">Case Competitions admin</h1>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link href="/admin/entries" className="border border-hairline p-6 transition-colors hover:border-teal">
            <p className="font-display text-lg text-ink">Entries &amp; results</p>
            <p className="mt-1 text-sm text-ink-soft">{entries.length} logged · past competitions MU has entered</p>
          </Link>
          <Link href="/admin/opportunities" className="border border-hairline p-6 transition-colors hover:border-teal">
            <p className="font-display text-lg text-ink">Opportunities</p>
            <p className="mt-1 text-sm text-ink-soft">{openCount} open of {opportunities.length} · upcoming, eligible to apply</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
