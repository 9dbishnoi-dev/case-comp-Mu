import Link from "next/link";
import { notFound } from "next/navigation";
import { getOpportunityForAdmin } from "@/lib/admin/data";
import { OpportunityForm } from "@/components/admin/OpportunityForm";
import { saveOpportunityAction } from "../../actions";

export const metadata = { title: "Edit opportunity — Admin", robots: "noindex" };

export default async function EditOpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const opportunity = await getOpportunityForAdmin(id);
  if (!opportunity) notFound();

  const action = saveOpportunityAction.bind(null, id);
  return (
    <main className="mx-auto max-w-xl px-6 py-14 md:px-8">
      <Link href="/admin/opportunities" className="text-sm text-ink-soft hover:text-ink">← Opportunities</Link>
      <h1 className="mt-3 font-display text-2xl text-ink">Edit opportunity</h1>
      <div className="mt-8"><OpportunityForm opportunity={opportunity} action={action} /></div>
    </main>
  );
}
