import Link from "next/link";
import { ExternalLink, House, LogOut } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { AdminProvider } from "@/components/admin/admin-context";
import { requireAdmin } from "@/lib/cms/auth";
import { rawImageBase } from "@/lib/cms/data";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <AdminProvider rawImageBase={rawImageBase()}>
    <header className="cms-topbar">
      <div className="cms-topbar-inner">
        <strong>Uređivanje stranice</strong>
        <Link href="/admin"><House size={16} aria-hidden="true" /> Početna ploča</Link>
        <a href="/" target="_blank" rel="noreferrer"><ExternalLink size={16} aria-hidden="true" /> Pogledaj stranicu</a>
        <form action={logout}><button type="submit"><LogOut size={16} aria-hidden="true" /> Odjava</button></form>
      </div>
    </header>
    <main className="cms-main">{children}</main>
  </AdminProvider>;
}
