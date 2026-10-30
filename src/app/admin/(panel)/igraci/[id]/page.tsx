import { notFound } from "next/navigation";
import { CmsForm } from "@/components/admin/cms-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { PageHeader } from "@/components/admin/page-header";
import { SavedNotice } from "@/components/admin/saved-notice";
import { loadAdminContent } from "@/lib/cms/data";
import { deletePlayer, savePlayer } from "../../competition-actions";
import { playerFields } from "../../competition-forms";

export default async function PlayerPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ spremljeno?: string }> }) {
  const [{ id }, { spremljeno }] = await Promise.all([params, searchParams]);
  const { competition } = await loadAdminContent();
  const isNew = id === "novi";
  const player = isNew ? undefined : competition.players.find((item) => item.id === id);
  if (!isNew && !player) notFound();
  const initial = player
    ? { displayName: player.displayName, team: player.teamId, ageGroup: player.ageGroup, active: player.active }
    : { displayName: "", team: "", ageGroup: "", active: true };

  return <>
    <PageHeader title={player?.displayName ?? "Novi igrač"} back={{ href: "/admin/igraci", label: "Svi igrači" }} />
    <SavedNotice show={spremljeno === "1"} />
    <CmsForm key={id} fields={playerFields(competition)} initial={initial} action={savePlayer.bind(null, player?.id ?? null)} />
    {player && <DeleteButton action={deletePlayer.bind(null, player.id)} label="Obriši igrača" confirmText={`Sigurno želite obrisati igrača ${player.displayName}?`} />}
  </>;
}
