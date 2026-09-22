"use server";

import { redirect } from "next/navigation";
import { signInWithPassword, signOut } from "@/lib/admin/auth";

function safeNext(next: string | null): string {
  if (!next || !next.startsWith("/admin") || next.startsWith("/admin/login")) {
    return "/admin";
  }
  return next;
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? ""));

  const error = await signInWithPassword(email, password);
  if (error) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`);
  }

  redirect(next);
}

export async function logoutAction() {
  await signOut();
  redirect("/admin/login");
}
