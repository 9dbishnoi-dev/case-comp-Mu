import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Bypasses RLS entirely — this is what all
 * admin writes (create/update/delete startups & founders, storage
 * uploads/deletes) go through. Only ever imported from server-only code
 * (Server Actions), and every caller must call requireAdmin() first so an
 * authenticated session is checked before any of these run.
 *
 * Never import this from a Client Component or anything that could ship
 * SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (see .env.local.example).",
    );
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
