import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { loadAdminContent } from "@/lib/cms/data";

export default async function PlayersPage({ searchParams }: { searchParams: Promise<{ uzrast?: string }> }) {
  const { uzrast } = await searchParams;
  const { competition } = await loadAdminContent();
  const teams = new Map(competition.teams.map((team) => [team.id, team.name]));
  const players = competition.players
    .filter((player) => !uzrast || player.ageGroup === uzrast)
    .sort((a, b) => a.displayName.localeCompare(b.displayName, "hr"));
  return <>
    <PageHeader title="Igrači" text="Igrači se mogu odabrati kao strijelci. Nije obavezno upisati sve igrače — strijelca možete upisati i ručno u utakmici." back={{ href: "/admin", label: "Početna ploča" }}>
      <Link className="cms-button cms-button--primary" href="/admin/igraci/novi"><Plus size={18} aria-hidden="true" /> Novi igrač</Link>
    </PageHeader>
    <nav className="cms-filters" aria-label="Filtriraj po uzrastu">
      <Link href="/admin/igraci" aria-current={!uzrast ? "page" : undefined}>Svi uzrasti</Link>
      {competition.ageGroups.map((group) => <Link key={group.id} href={`/admin/igraci?uzrast=${group.id}`} aria-current={uzrast === group.id ? "page" : undefined}>{group.year}</Link>)}
    </nav>
    {!players.length && <p className="cms-empty">Još nema igrača.</p>}
    <div className="cms-rows">{players.map((player) => <div key={player.id} className="cms-row">
      <div className="cms-row-main"><strong>{player.displayName}</strong><small>{teams.get(player.teamId)} · Uzrast {player.ageGroup}</small>{!player.active && <div><span className="cms-badge cms-badge--muted">Neaktivan</span></div>}</div>
      <div className="cms-row-actions"><Link className="cms-button" href={`/admin/igraci/${player.id}`}><Pencil size={16} aria-hidden="true" /> Uredi</Link></div>
    </div>)}</div>
  </>;
}
