import Link from "next/link";
import { OpportunityForm } from "@/components/admin/OpportunityForm";
import { saveOpportunityAction } from "../../actions";

export const metadata = { title: "Add opportunity — Admin", robots: "noindex" };

export default function NewOpportunityPage() {
  const action = saveOpportunityAction.bind(null, null);
  return (
    <main className="mx-auto max-w-xl px-6 py-14 md:px-8">
      <Link href="/admin/opportunities" className="text-sm text-ink-soft hover:text-ink">← Opportunities</Link>
      <h1 className="mt-3 font-display text-2xl text-ink">Add opportunity</h1>
      <div className="mt-8"><OpportunityForm action={action} /></div>
    </main>
  );
}
