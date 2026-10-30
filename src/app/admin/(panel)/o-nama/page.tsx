import { CmsForm } from "@/components/admin/cms-form";
import { PageHeader } from "@/components/admin/page-header";
import { loadAdminContent } from "@/lib/cms/data";
import { saveAbout } from "../site-actions";
import { aboutFields } from "../site-forms";

export default async function Page() {
  const { site } = await loadAdminContent();
  return <>
    <PageHeader title="O nama" text="Tekstovi i fotografija na stranici O nama." back={{ href: "/admin", label: "Početna ploča" }} />
    <CmsForm fields={aboutFields} initial={{ ...site.about, image: { photo: { src: site.about.image.src, width: 1200, height: 900 }, alt: site.about.image.alt } }} action={saveAbout} />
  </>;
}
