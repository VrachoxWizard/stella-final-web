import { notFound } from "next/navigation";
import { CmsForm } from "@/components/admin/cms-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { PageHeader } from "@/components/admin/page-header";
import { SavedNotice } from "@/components/admin/saved-notice";
import { loadAdminContent } from "@/lib/cms/data";
import { deleteAgeGroup, saveAgeGroup } from "../../competition-actions";
import { ageGroupFields } from "../../competition-forms";

export default async function AgeGroupPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ spremljeno?: string }> }) {
  const [{ id }, { spremljeno }] = await Promise.all([params, searchParams]);
  const { competition } = await loadAdminContent();
  const isNew = id === "novi";
  const group = isNew ? undefined : competition.ageGroups.find((item) => item.id === id);
  if (!isNew && !group) notFound();
  const nextOrder = Math.max(0, ...competition.ageGroups.map((item) => item.sortOrder)) + 1;
  const initial = group
    ? { year: group.year, title: group.title, description: group.description, sortOrder: group.sortOrder, active: group.active }
    : { year: "", title: "", description: "", sortOrder: nextOrder, active: true };

  return <>
    <PageHeader title={group?.title ?? "Novi uzrast"} back={{ href: "/admin/uzrasti", label: "Svi uzrasti" }} />
    <SavedNotice show={spremljeno === "1"} />
    <CmsForm key={id} fields={ageGroupFields(isNew)} initial={initial} action={saveAgeGroup.bind(null, group?.id ?? null)} />
    {group && <DeleteButton action={deleteAgeGroup.bind(null, group.id)} label="Obriši uzrast" confirmText={`Sigurno želite obrisati ${group.title}?`} />}
  </>;
}
