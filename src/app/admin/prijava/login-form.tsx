"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return <form action={action}>
    <div className="cms-field">
      <label className="cms-label" htmlFor="password">Lozinka</label>
      <input id="password" name="password" className="cms-input" type="password" autoComplete="current-password" required autoFocus />
    </div>
    <button className="cms-button cms-button--primary" type="submit" disabled={pending}>{pending ? "Prijavljujem…" : "Prijavi se"}</button>
    {state && <p role="alert" className="cms-message cms-message--error">{state.message}</p>}
  </form>;
}
