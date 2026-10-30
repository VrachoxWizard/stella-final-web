import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { AdminImage } from "@/components/admin/admin-context";
import { PageHeader } from "@/components/admin/page-header";
import { loadAdminContent } from "@/lib/cms/data";

export default async function TeamsPage() {
  const { competition } = await loadAdminContent();
  const teams = [...competition.teams].sort((a, b) => a.name.localeCompare(b.name, "hr"));
  return <>
    <PageHeader title="Klubovi" text="Klubovi koje možete odabrati u utakmicama." back={{ href: "/admin", label: "Početna ploča" }}>
      <Link className="cms-button cms-button--primary" href="/admin/klubovi/novi"><Plus size={18} aria-hidden="true" /> Novi klub</Link>
    </PageHeader>
    {!teams.length && <p className="cms-empty">Još nema klubova. Kliknite „Novi klub”.</p>}
    <div className="cms-rows">{teams.map((team) => <div key={team.id} className="cms-row">
      {team.crest && <AdminImage src={team.crest} alt="" className="cms-crest" />}
      <div className="cms-row-main"><strong>{team.name}</strong><small>Uzrasti: {team.ageGroups.join(", ")}</small>{!team.active && <div><span className="cms-badge cms-badge--muted">Neaktivan</span></div>}</div>
      <div className="cms-row-actions"><Link className="cms-button" href={`/admin/klubovi/${team.id}`}><Pencil size={16} aria-hidden="true" /> Uredi</Link></div>
    </div>)}</div>
  </>;
}
