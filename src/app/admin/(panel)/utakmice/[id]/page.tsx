import { notFound } from "next/navigation";
import { CmsForm } from "@/components/admin/cms-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { PageHeader } from "@/components/admin/page-header";
import { SavedNotice } from "@/components/admin/saved-notice";
import { loadAdminContent } from "@/lib/cms/data";
import { deleteMatch, saveMatch } from "../../competition-actions";
import { matchFields, matchInitial } from "../../competition-forms";

export default async function MatchPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ spremljeno?: string }> }) {
  const [{ id }, { spremljeno }] = await Promise.all([params, searchParams]);
  const { competition } = await loadAdminContent();
  const isNew = id === "nova";
  const match = isNew ? undefined : competition.matches.find((item) => item.id === id);
  if (!isNew && !match) notFound();

  return <>
    <PageHeader title={match ? `${match.homeTeam.name} – ${match.awayTeam.name}` : "Nova utakmica"} back={{ href: "/admin/utakmice", label: "Sve utakmice" }} />
    <SavedNotice show={spremljeno === "1"} />
    {!competition.teams.length && <div className="cms-notice cms-notice--warning"><p>Prije prve utakmice dodajte klubove (Početna ploča → Klubovi).</p></div>}
    {!competition.seasons.length && <div className="cms-notice cms-notice--warning"><p>Prije prve utakmice dodajte sezonu (Početna ploča → Sezone).</p></div>}
    <CmsForm key={id} fields={matchFields(competition)} initial={matchInitial(competition, match)} action={saveMatch.bind(null, match?.id ?? null)} submitLabel={isNew ? "Spremi utakmicu" : "Spremi promjene"} />
    {match && <DeleteButton action={deleteMatch.bind(null, match.id)} label="Obriši utakmicu" confirmText="Sigurno želite obrisati ovu utakmicu? Ovo se ne može poništiti." />}
  </>;
}
