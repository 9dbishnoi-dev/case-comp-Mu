import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client, using the public anon key. Used for the
 * admin login form and for the drag-drop photo uploader (uploads go
 * straight from the browser to Storage under the signed-in user's auth,
 * so they never touch our server as a big base64 blob).
 */
export function getSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
