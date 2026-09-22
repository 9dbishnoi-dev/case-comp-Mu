import "server-only";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * Real per-user auth via Supabase Auth (email + password). Anyone who
 * signs in successfully is treated as an admin — there is no separate
 * roles table. Access is controlled by *who has an account*: you add
 * teammates from Supabase Dashboard → Authentication → Users → Add user,
 * not through a signup form (there isn't one).
 */

/** Returns the signed-in user, or null if not authenticated. */
export async function getAdminUser() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Call at the top of every admin Server Action / admin page. Redirects to login if not signed in. */
export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = await getSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? error.message : null;
}

export async function signOut() {
  const supabase = await getSupabaseServer();
  await supabase.auth.signOut();
}
