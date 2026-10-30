import { CmsForm } from "@/components/admin/cms-form";
import { PageHeader } from "@/components/admin/page-header";
import { loadAdminContent } from "@/lib/cms/data";
import { savePrivacy } from "../site-actions";
import { privacyFields } from "../site-forms";

export default async function Page() {
  const { site } = await loadAdminContent();
  return <>
    <PageHeader title="Privatnost" text="Tekst stranice o zaštiti osobnih podataka." back={{ href: "/admin", label: "Početna ploča" }} />
    <CmsForm fields={privacyFields} initial={site.privacy} action={savePrivacy} />
  </>;
}
