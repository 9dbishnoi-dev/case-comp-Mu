import { login } from "./actions";
import { PasswordField } from "@/components/admin/PasswordField";
import { SubmitButton } from "@/components/admin/SubmitButton";

export const metadata = {
  title: "Admin sign in — Case Competitions",
  robots: "noindex",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl text-ink">Admin sign in</h1>
        <p className="mt-1 text-sm text-ink-soft">The Founders&rsquo; Register</p>

        <form action={login} className="mt-8 flex flex-col gap-4">
          <input type="hidden" name="next" value={next ?? "/admin"} />

          <label className="flex flex-col gap-1.5 text-sm text-ink">
            Email
            <input
              type="email"
              name="email"
              required
              autoFocus
              autoComplete="email"
              className="border border-hairline bg-panel px-3 py-2.5 text-[15px] text-ink placeholder:text-ink-faint focus:border-brass focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-ink">
            Password
            <PasswordField
              name="password"
              autoComplete="current-password"
              className="border border-hairline bg-panel px-3 py-2.5 text-[15px] text-ink placeholder:text-ink-faint focus:border-brass focus:outline-none"
            />
          </label>

          {error && (
            <p className="text-sm text-rust">
              Couldn&rsquo;t sign in. Check your email and password.
            </p>
          )}

          <SubmitButton className="mt-2" pendingLabel="Signing in…">
            Sign in
          </SubmitButton>
        </form>

        <p className="mt-6 text-xs text-ink-faint">
          No account? Ask a teammate with dashboard access to add you under
          Supabase &rarr; Authentication &rarr; Users.
        </p>
      </div>
    </main>
  );
}
