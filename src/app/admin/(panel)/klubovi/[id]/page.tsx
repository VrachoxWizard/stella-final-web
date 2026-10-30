import { notFound } from "next/navigation";
import { CmsForm } from "@/components/admin/cms-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { PageHeader } from "@/components/admin/page-header";
import { SavedNotice } from "@/components/admin/saved-notice";
import { loadAdminContent } from "@/lib/cms/data";
import { deleteTeam, saveTeam } from "../../competition-actions";
import { teamFields } from "../../competition-forms";

export default async function TeamPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ spremljeno?: string }> }) {
  const [{ id }, { spremljeno }] = await Promise.all([params, searchParams]);
  const { competition } = await loadAdminContent();
  const isNew = id === "novi";
  const team = isNew ? undefined : competition.teams.find((item) => item.id === id);
  if (!isNew && !team) notFound();
  const initial = team
    ? { name: team.name, shortName: team.shortName ?? "", crest: team.crest ? { src: team.crest, width: 200, height: 200 } : null, ageGroups: team.ageGroups, active: team.active }
    : { name: "", shortName: "", crest: null, ageGroups: [], active: true };

  return <>
    <PageHeader title={team?.name ?? "Novi klub"} back={{ href: "/admin/klubovi", label: "Svi klubovi" }} />
    <SavedNotice show={spremljeno === "1"} />
    <CmsForm key={id} fields={teamFields(competition)} initial={initial} action={saveTeam.bind(null, team?.id ?? null)} />
    {team && <DeleteButton action={deleteTeam.bind(null, team.id)} label="Obriši klub" confirmText={`Sigurno želite obrisati klub ${team.name}?`} />}
  </>;
}
