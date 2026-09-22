import "server-only";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Server-side Supabase client that reads/writes the auth session via
 * cookies. Use this anywhere you need to know *who* is signed in
 * (middleware, requireAdmin(), the login/logout actions). It respects
 * RLS — it is NOT the service-role client and cannot write to
 * startups/founders (there are no write policies for it by design).
 */
export async function getSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[],
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component (not an Action/Route Handler).
            // Safe to ignore as long as middleware is refreshing sessions.
          }
        },
      },
    },
  );
}
