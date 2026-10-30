import { CmsForm } from "@/components/admin/cms-form";
import { PageHeader } from "@/components/admin/page-header";
import { loadAdminContent } from "@/lib/cms/data";
import { saveContactPage } from "../site-actions";
import { contactPageFields } from "../site-forms";

export default async function Page() {
  const { site } = await loadAdminContent();
  return <>
    <PageHeader title="Stranica Kontakt" text="Tekstovi na stranici Kontakt." back={{ href: "/admin", label: "Početna ploča" }} />
    <CmsForm fields={contactPageFields} initial={site.contact} action={saveContactPage} />
  </>;
}
