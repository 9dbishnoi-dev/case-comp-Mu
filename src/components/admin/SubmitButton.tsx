"use client";

import { useFormStatus } from "react-dom";

const VARIANT_CLASS = {
  primary:
    "bg-brass px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-brass-deep disabled:cursor-not-allowed disabled:opacity-60",
  primarySmall:
    "self-start bg-brass px-3 py-1.5 text-sm font-medium text-paper transition-colors hover:bg-brass-deep disabled:cursor-not-allowed disabled:opacity-60",
  link: "text-sm text-ink-soft underline decoration-hairline underline-offset-4 hover:text-ink hover:decoration-brass disabled:cursor-not-allowed disabled:opacity-60",
  danger:
    "text-sm text-rust hover:underline disabled:cursor-not-allowed disabled:opacity-60",
} as const;

/**
 * Drop-in replacement for <button type="submit">. Must be rendered as a
 * descendant of a <form action={...}> — a *different* component than the
 * one that renders the <form> itself (a React rule for useFormStatus).
 * Automatically disables itself and swaps its label while that form's
 * action is in flight, so every submit in the admin panel gives the same
 * "yes, your click registered" feedback without each caller wiring up its
 * own pending state.
 */
export function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: keyof typeof VARIANT_CLASS;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`${VARIANT_CLASS[variant]}${className ? ` ${className}` : ""}`}
    >
      {pending && (
        <span
          aria-hidden="true"
          className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent align-[-2px]"
        />
      )}
      {pending ? (pendingLabel ?? "Saving…") : children}
    </button>
  );
}
