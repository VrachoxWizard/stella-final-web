import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { site } from "@/lib/data";

export const metadata: Metadata = { title: "Privatnost", description: "Informacije o privatnosti i obradi osobnih podataka.", alternates: { canonical: "/privatnost" } };

export default function PrivacyPage() {
  return <><PageHero eyebrow="Transparentno i jasno" title="Privatnost" copy="Kako postupamo s podacima povezanima s ovom web-stranicom." word="Fair" image="/images/Naslovna-fotka-2.jpg" /><section className="section section-white"><article className="shell legal">
    <p><strong>Posljednje ažuriranje:</strong> 28. kolovoza 2026.</p>
    <p>Ova stranica opisuje osnovni način postupanja s osobnim podacima na web-stranici Tina Šport–Pia.</p>
    <h2>Kontakt</h2><p>Web-stranica trenutačno nema kontaktni obrazac. Ako nam se javite e-mailom ili telefonom, podatke koje dobrovoljno pošaljete upotrebljavamo isključivo radi odgovora na vaš upit i organizacije aktivnosti.</p>
    <h2>Medijski sadržaj</h2><p>Fotografije i videozapisi objavljuju se uz odgovarajuće dopuštenje organizatora i sudionika. Za pitanje ili zahtjev povezan s objavljenim sadržajem kontaktirajte nas.</p>
    <h2>Vaša prava</h2><p>Možete zatražiti pristup, ispravak ili brisanje podataka koje ste nam poslali. Za zahtjev se javite na <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
    <h2>Voditelj obrade</h2><p>Tina Šport–Pia, {site.address}. Kontakt: {site.organizer}, {site.phone}.</p>
  </article></section></>;
}
