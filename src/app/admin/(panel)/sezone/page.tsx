import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { loadAdminContent } from "@/lib/cms/data";

export default async function SeasonsPage() {
  const { competition } = await loadAdminContent();
  const seasons = [...competition.seasons].sort((a, b) => b.startDate.localeCompare(a.startDate));
  return <>
    <PageHeader title="Sezone" text="Na stranici se prikazuju samo utakmice aktivne sezone." back={{ href: "/admin", label: "Početna ploča" }}>
      <Link className="cms-button cms-button--primary" href="/admin/sezone/nova"><Plus size={18} aria-hidden="true" /> Nova sezona</Link>
    </PageHeader>
    {!seasons.length && <div className="cms-notice cms-notice--warning"><p>Još nema nijedne sezone. Dodajte sezonu i označite je kao aktivnu prije unosa utakmica.</p></div>}
    <div className="cms-rows">{seasons.map((season) => <div key={season.id} className="cms-row">
      <div className="cms-row-main"><strong>{season.name}</strong><small>{season.startDate} – {season.endDate} · bodovi {season.points.win}/{season.points.draw}/{season.points.loss}</small>{season.active && <div><span className="cms-badge cms-badge--ok">Aktivna</span></div>}</div>
      <div className="cms-row-actions"><Link className="cms-button" href={`/admin/sezone/${season.id}`}><Pencil size={16} aria-hidden="true" /> Uredi</Link></div>
    </div>)}</div>
  </>;
}
