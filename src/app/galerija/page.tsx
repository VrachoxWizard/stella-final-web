import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery-grid";
import { MatchdayFilm } from "@/components/matchday-film";
import { PageHero } from "@/components/page-hero";
import { getGallery } from "@/lib/content";

export const metadata: Metadata = { title: "Galerija", description: "Fotografije s utakmica i događanja Tina Šport–Pia lige.", alternates: { canonical: "/galerija" } };

export default async function GalleryPage() {
  const gallery = await getGallery();
  return <><PageHero eyebrow="Atmosfera lige" title="Galerija" copy="Pogledi s tribina, zagrljaji nakon gola i zajedničke fotografije — sport kroz trenutke koji ostaju." word="Tim" image="/images/video-matchday-poster.jpg" /><MatchdayFilm /><section className="section section-white"><div className="shell"><GalleryGrid images={gallery} /></div></section></>;
}
