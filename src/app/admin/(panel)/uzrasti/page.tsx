import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { loadAdminContent } from "@/lib/cms/data";

export default async function AgeGroupsPage() {
  const { competition } = await loadAdminContent();
  return <>
    <PageHeader title="Uzrasti" text="Svaki aktivni uzrast ima svoju stranicu i stavku u izborniku." back={{ href: "/admin", label: "Početna ploča" }}>
      <Link className="cms-button cms-button--primary" href="/admin/uzrasti/novi"><Plus size={18} aria-hidden="true" /> Novi uzrast</Link>
    </PageHeader>
    <div className="cms-rows">{competition.ageGroups.map((group) => <div key={group.id} className="cms-row">
      <div className="cms-row-main"><strong>{group.title}</strong><small>{group.description}</small>{!group.active && <div><span className="cms-badge cms-badge--muted">Skriveno</span></div>}</div>
      <div className="cms-row-actions"><Link className="cms-button" href={`/admin/uzrasti/${group.id}`}><Pencil size={16} aria-hidden="true" /> Uredi</Link></div>
    </div>)}</div>
  </>;
}
