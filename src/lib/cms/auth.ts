import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/cms/session";

export async function isLoggedIn() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** Call at the top of every admin page and server action. */
export async function requireAdmin() {
  if (!(await isLoggedIn())) redirect("/admin/prijava");
}

const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

/** Best-effort limit per server instance; combined with a delay it makes guessing slow. */
export function registerFailedLogin(ip: string, now = Date.now()) {
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  else entry.count += 1;
}

export function isLoginBlocked(ip: string, now = Date.now()) {
  const entry = attempts.get(ip);
  return Boolean(entry && entry.resetAt >= now && entry.count >= MAX_ATTEMPTS);
}

export function clearFailedLogins(ip: string) {
  attempts.delete(ip);
}
