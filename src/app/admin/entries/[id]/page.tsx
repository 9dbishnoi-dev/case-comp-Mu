import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntryForAdmin } from "@/lib/admin/data";
import { EntryForm } from "@/components/admin/EntryForm";
import { saveEntryAction } from "../../actions";

export const metadata = { title: "Edit entry — Admin", robots: "noindex" };

export default async function EditEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await getEntryForAdmin(id);
  if (!entry) notFound();

  const action = saveEntryAction.bind(null, id);
  return (
    <main className="mx-auto max-w-xl px-6 py-14 md:px-8">
      <Link href="/admin/entries" className="text-sm text-ink-soft hover:text-ink">← Entries</Link>
      <h1 className="mt-3 font-display text-2xl text-ink">Edit entry</h1>
      <div className="mt-8"><EntryForm entry={entry} action={action} /></div>
    </main>
  );
}
