"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { clearFailedLogins, isLoginBlocked, registerFailedLogin } from "@/lib/cms/auth";
import { checkPassword, createSessionToken, isAuthConfigured, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/cms/session";

export type LoginState = { message: string } | null;

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAuthConfigured()) {
    return { message: "Prijava još nije podešena. Administrator mora postaviti ADMIN_PASSWORD i SESSION_SECRET." };
  }
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "lokalno";
  if (isLoginBlocked(ip)) return { message: "Previše neuspjelih pokušaja. Pričekajte 15 minuta pa pokušajte ponovno." };

  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    registerFailedLogin(ip);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { message: "Lozinka nije točna. Pokušajte ponovno." };
  }

  clearFailedLogins(ip);
  (await cookies()).set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: "/admin" });
  redirect("/admin/prijava");
}
