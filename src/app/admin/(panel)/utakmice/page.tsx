import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { loadAdminContent } from "@/lib/cms/data";
import { formatZagreb } from "@/lib/cms/utils";
import { statusLabels } from "../competition-forms";

export default async function MatchesPage({ searchParams }: { searchParams: Promise<{ uzrast?: string }> }) {
  const { uzrast } = await searchParams;
  const { competition } = await loadAdminContent();
  const matches = competition.matches
    .filter((match) => !uzrast || match.ageGroup === uzrast)
    .sort((a, b) => b.kickoff.localeCompare(a.kickoff));

  return <>
    <PageHeader title="Utakmice i rezultati" text="Najnovije utakmice su na vrhu. Nakon utakmice kliknite „Upiši rezultat”." back={{ href: "/admin", label: "Početna ploča" }}>
      <Link className="cms-button cms-button--primary" href="/admin/utakmice/nova"><Plus size={18} aria-hidden="true" /> Nova utakmica</Link>
    </PageHeader>
    <nav className="cms-filters" aria-label="Filtriraj po uzrastu">
      <Link href="/admin/utakmice" aria-current={!uzrast ? "page" : undefined}>Svi uzrasti</Link>
      {competition.ageGroups.map((group) => <Link key={group.id} href={`/admin/utakmice?uzrast=${group.id}`} aria-current={uzrast === group.id ? "page" : undefined}>{group.year}</Link>)}
    </nav>
    {!matches.length && <p className="cms-empty">Još nema utakmica{uzrast ? " za ovaj uzrast" : ""}. Kliknite „Nova utakmica”.</p>}
    <div className="cms-rows">{matches.map((match) => {
      const played = match.status === "played";
      return <div key={match.id} className="cms-row">
        <div className="cms-row-main">
          <strong>{match.homeTeam.name} – {match.awayTeam.name} {played && <span className="cms-score">{match.homeScore}:{match.awayScore}</span>}</strong>
          <small>{formatZagreb(match.kickoff)} · Uzrast {match.ageGroup} · {match.round} · {match.venue}</small>
          <div><span className={`cms-badge ${played ? "cms-badge--ok" : match.status === "scheduled" ? "" : "cms-badge--warn"}`}>{statusLabels[match.status]}</span> {match.visibility === "draft" && <span className="cms-badge cms-badge--muted">Skriveno</span>}</div>
        </div>
        <div className="cms-row-actions">
          {!played && <Link className="cms-button cms-button--primary" href={`/admin/utakmice/${match.id}#rezultat`}>Upiši rezultat</Link>}
          <Link className="cms-button" href={`/admin/utakmice/${match.id}`}><Pencil size={16} aria-hidden="true" /> Uredi</Link>
        </div>
      </div>;
    })}</div>
  </>;
}
