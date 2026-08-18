import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { site } from "@/lib/data";

export const metadata: Metadata = { title: "Privatnost", description: "Informacije o privatnosti i obradi osobnih podataka.", alternates: { canonical: "/privatnost" } };

export default function PrivacyPage() {
  return <><PageHero eyebrow="Transparentno i jasno" title="Privatnost" copy="Kako postupamo s podacima koje nam pošaljete putem ove web-stranice." word="Fair" image="/images/Naslovna-fotka-2.jpg" /><section className="section section-white"><article className="shell legal">
    <p><strong>Posljednje ažuriranje:</strong> 4. kolovoza 2026.</p>
    <p>Ova stranica opisuje osnovni način obrade osobnih podataka na web-stranici Tina Šport–Pia. Konačni tekst prije produkcijske objave treba potvrditi vlasnik stranice.</p>
    <h2>Podaci koje prikupljamo</h2><p>Kada nam pošaljete kontaktni obrazac, obrađujemo ime, adresu e-pošte i sadržaj poruke isključivo radi odgovora na vaš upit. Ne tražimo podatke koji nisu potrebni za tu svrhu.</p>
    <h2>Kontaktni obrazac</h2><p>Poruke se dostavljaju putem usluge Formspree. Slanjem obrasca potvrđujete da ste pročitali obavijest uz obrazac i pristajete na obradu podataka potrebnu za odgovor.</p>
    <h2>Medijski sadržaj</h2><p>Fotografije i videozapisi objavljuju se uz odgovarajuće dopuštenje organizatora i sudionika. Za pitanje ili zahtjev povezan s objavljenim sadržajem kontaktirajte nas.</p>
    <h2>Vaša prava</h2><p>Možete zatražiti pristup, ispravak ili brisanje podataka koje ste nam poslali. Za zahtjev se javite na <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
    <h2>Voditelj obrade</h2><p>Tina Šport–Pia, {site.address}. Kontakt: {site.organizer}, {site.phone}.</p>
  </article></section></>;
}
