import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery-grid";
import { PageHero } from "@/components/page-hero";
import { getSite } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSite();
  return { title: "Galerija", description: `Fotografije s utakmica i događanja ${settings.name} lige.`, alternates: { canonical: "/galerija" } };
}

export default async function GalleryPage() {
  const { pages, gallery } = await getSite();
  const hero = pages.gallery;
  return <><PageHero eyebrow={hero.eyebrow} title={hero.title} copy={hero.text} word={hero.word} /><section className="section section-white"><div className="shell"><GalleryGrid images={gallery.images} /></div></section></>;
}
