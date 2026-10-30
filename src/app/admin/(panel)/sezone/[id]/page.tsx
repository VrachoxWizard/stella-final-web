import { notFound } from "next/navigation";
import { CmsForm } from "@/components/admin/cms-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { PageHeader } from "@/components/admin/page-header";
import { SavedNotice } from "@/components/admin/saved-notice";
import { loadAdminContent } from "@/lib/cms/data";
import { deleteSeason, saveSeason } from "../../competition-actions";
import { seasonFields } from "../../competition-forms";

export default async function SeasonPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ spremljeno?: string }> }) {
  const [{ id }, { spremljeno }] = await Promise.all([params, searchParams]);
  const { competition } = await loadAdminContent();
  const isNew = id === "nova";
  const season = isNew ? undefined : competition.seasons.find((item) => item.id === id);
  if (!isNew && !season) notFound();
  const initial = season
    ? { name: season.name, startDate: season.startDate, endDate: season.endDate, active: season.active, pointsWin: season.points.win, pointsDraw: season.points.draw, pointsLoss: season.points.loss }
    : { name: "", startDate: "", endDate: "", active: competition.seasons.length === 0, pointsWin: 3, pointsDraw: 1, pointsLoss: 0 };

  return <>
    <PageHeader title={season?.name ?? "Nova sezona"} back={{ href: "/admin/sezone", label: "Sve sezone" }} />
    <SavedNotice show={spremljeno === "1"} />
    <CmsForm key={id} fields={seasonFields} initial={initial} action={saveSeason.bind(null, season?.id ?? null)} />
    {season && <DeleteButton action={deleteSeason.bind(null, season.id)} label="Obriši sezonu" confirmText={`Sigurno želite obrisati sezonu ${season.name}?`} />}
  </>;
}
