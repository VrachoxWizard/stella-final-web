"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useTransition } from "react";
import { Trash2 } from "lucide-react";
import type { ActionResult } from "@/components/admin/cms-form";

export function DeleteButton({ action, confirmText, label = "Obriši" }: { action: (previous: ActionResult | null) => Promise<ActionResult>; confirmText: string; label?: string }) {
  const router = useRouter();
  const [result, run, pending] = useActionState(action, null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (result?.ok && result.redirectTo) router.push(result.redirectTo);
  }, [result, router]);

  return <div className="cms-delete">
    <button type="button" className="cms-button cms-button--danger" disabled={pending} onClick={() => {
      if (window.confirm(confirmText)) startTransition(() => run());
    }}><Trash2 size={18} aria-hidden="true" /> {pending ? "Brišem…" : label}</button>
    {result && !result.ok && <p role="status" className="cms-message cms-message--error">{result.message}</p>}
  </div>;
}
