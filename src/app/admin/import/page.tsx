import { ImportForm } from "@/components/admin/ImportForm";

// Fetching + re-uploading founder photos and writing dozens of rows can
// run past Vercel's default 10s serverless timeout. 60s is the max
// allowed on the free (Hobby) plan.
export const maxDuration = 60;

export const metadata = { title: "Import CSV — Admin", robots: "noindex" };

export default function ImportPage() {
  return <ImportForm />;
}
