import Link from "next/link";
import { listOpportunitiesForAdmin } from "@/lib/admin/data";
import { deleteOpportunityAction } from "../actions";
import { MuLogo } from "@/components/MuLogo";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { OpportunityStatusPill } from "@/components/OpportunityStatusPill";
import { logoutAction } from "../login/actions";

export const metadata = { title: "Opportunities — Admin", robots: "noindex" };

export default async function AdminOpportunitiesPage() {
  const opportunities = await listOpportunitiesForAdmin();

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
          <h1 className="font-display text-2xl text-ink">Opportunities</h1>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm text-ink-soft hover:text-ink">← Admin home</Link>
            <Link href="/admin/opportunities/new" className="bg-brass px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-brass/90">
              Add opportunity
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col divide-y divide-hairline border-t border-hairline">
          {opportunities.length === 0 && (
            <p className="py-8 text-sm text-ink-soft">No opportunities yet — add the first one.</p>
          )}
          {opportunities.map((o) => (
            <div key={o.id} className="flex items-center justify-between gap-4 py-4">
              <Link href={`/admin/opportunities/${o.id}`} className="min-w-0 flex-1 hover:opacity-80">
                <p className="truncate text-ink">{o.name}</p>
                <p className="mt-0.5 text-sm text-ink-soft">
                  {o.host} {o.deadline ? `· Apply by ${o.deadline}` : ""}
                </p>
              </Link>
              <div className="flex items-center gap-4">
                <OpportunityStatusPill status={o.status} />
                <form action={deleteOpportunityAction.bind(null, o.id)}>
                  <SubmitButton variant="danger" pendingLabel="Deleting…">Delete</SubmitButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
