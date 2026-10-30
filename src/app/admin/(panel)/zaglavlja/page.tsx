import { CmsForm } from "@/components/admin/cms-form";
import { PageHeader } from "@/components/admin/page-header";
import { loadAdminContent } from "@/lib/cms/data";
import { savePages } from "../site-actions";
import { pagesFields } from "../site-forms";

export default async function Page() {
  const { site } = await loadAdminContent();
  return <>
    <PageHeader title="Ostali tekstovi" text="Zaglavlja stranica Raspored i Galerija te tekstovi na stranicama uzrasta." back={{ href: "/admin", label: "Početna ploča" }} />
    <CmsForm fields={pagesFields} initial={site.pages} action={savePages} />
  </>;
}
