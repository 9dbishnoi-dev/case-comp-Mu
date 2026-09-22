"use client";

import { useState } from "react";

/**
 * A password input with a Show/Hide toggle so you can check what you
 * actually typed before submitting. This only reveals what's currently
 * in the field — it can't recover a password you've already forgotten,
 * since Supabase never stores one in a readable form. For that, reset it
 * from Supabase Dashboard → Authentication → Users.
 */
export function PasswordField({
  name,
  autoComplete,
  className,
}: {
  name: string;
  autoComplete?: string;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        name={name}
        required
        autoComplete={autoComplete}
        className={`${className ?? ""} w-full pr-16`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 px-3 text-xs text-ink-soft hover:text-ink"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
