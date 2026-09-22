import Link from "next/link";
import { EntryForm } from "@/components/admin/EntryForm";
import { saveEntryAction } from "../../actions";

export const metadata = { title: "Add entry — Admin", robots: "noindex" };

export default function NewEntryPage() {
  const action = saveEntryAction.bind(null, null);
  return (
    <main className="mx-auto max-w-xl px-6 py-14 md:px-8">
      <Link href="/admin/entries" className="text-sm text-ink-soft hover:text-ink">← Entries</Link>
      <h1 className="mt-3 font-display text-2xl text-ink">Add entry</h1>
      <div className="mt-8"><EntryForm action={action} /></div>
    </main>
  );
}
