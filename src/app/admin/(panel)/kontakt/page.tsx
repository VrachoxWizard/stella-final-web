import { CmsForm } from "@/components/admin/cms-form";
import { PageHeader } from "@/components/admin/page-header";
import { loadAdminContent } from "@/lib/cms/data";
import { saveSettings } from "../site-actions";
import { settingsFields } from "../site-forms";

export default async function Page() {
  const { site } = await loadAdminContent();
  return <>
    <PageHeader title="Kontakt podaci" text="E-mail, telefon, adresa i društvene mreže. Mijenjaju se na svim stranicama odjednom." back={{ href: "/admin", label: "Početna ploča" }} />
    <CmsForm fields={settingsFields} initial={site.settings} action={saveSettings} />
  </>;
}
