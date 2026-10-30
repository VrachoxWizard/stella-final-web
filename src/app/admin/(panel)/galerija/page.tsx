import { CmsForm } from "@/components/admin/cms-form";
import { PageHeader } from "@/components/admin/page-header";
import { loadAdminContent } from "@/lib/cms/data";
import { saveGallery } from "../site-actions";
import { galleryFields } from "../site-forms";

export default async function Page() {
  const { site } = await loadAdminContent();
  return <>
    <PageHeader title="Galerija" text="Dodajte nove fotografije, upišite opis i odaberite gdje se prikazuju. Obrisana fotografija nestaje sa stranice." back={{ href: "/admin", label: "Početna ploča" }} />
    <CmsForm fields={galleryFields} initial={{ images: site.gallery.images.map(({ src, width, height, ...image }) => ({ ...image, image: { src, width, height } })) }} action={saveGallery} />
  </>;
}
