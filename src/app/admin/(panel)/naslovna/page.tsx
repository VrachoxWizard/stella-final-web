import { CmsForm } from "@/components/admin/cms-form";
import { PageHeader } from "@/components/admin/page-header";
import { loadAdminContent } from "@/lib/cms/data";
import { saveHome } from "../site-actions";
import { homeFields } from "../site-forms";

export default async function Page() {
  const { site } = await loadAdminContent();
  return <>
    <PageHeader title="Naslovna stranica" text="Veliki naslov na vrhu i naslovi sekcija na naslovnici." back={{ href: "/admin", label: "Početna ploča" }} />
    <CmsForm fields={homeFields} initial={site.home} action={saveHome} />
  </>;
}
