import { CmsForm } from "@/components/admin/cms-form";
import { PageHeader } from "@/components/admin/page-header";
import { loadAdminContent } from "@/lib/cms/data";
import { saveAnnouncements } from "../site-actions";
import { announcementFields } from "../site-forms";

export default async function Page() {
  const { site } = await loadAdminContent();
  return <>
    <PageHeader title="Obavijesti (Aktualno)" text="Najave koje se prikazuju na naslovnici odmah ispod velikog naslova." back={{ href: "/admin", label: "Početna ploča" }} />
    <CmsForm fields={announcementFields} initial={site.announcements} action={saveAnnouncements} />
  </>;
}
