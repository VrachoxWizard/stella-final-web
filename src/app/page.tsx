import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { AgeNavigation } from "@/components/age-navigation";
import { CompetitionEmptyState } from "@/components/competition-empty-state";
import { MatchCard } from "@/components/match-card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { skradinGallery } from "@/lib/data";
import { getAnnouncements, getGallery, getMatches } from "@/lib/content";

export default async function HomePage() {
  const [matches, announcements, gallery] = await Promise.all([getMatches(), getAnnouncements(), getGallery()]);
  const fixtures = matches.filter((match) => match.status === "scheduled").slice(0, 3);
  const league = announcements.find((item) => item.id === "league-registration-2026");
  const skradin = announcements.find((item) => item.id === "skradin-2026");
  const galleryPreview = ["g1", "g29", "g23", "g12", "g32"].map((id) => gallery.find((image) => image.id === id)).filter((image): image is NonNullable<typeof image> => Boolean(image));

  return <>
    <section className="hero">
      <div className="hero-media hero-media--placeholder" aria-hidden="true" />
      <div className="shell hero-grid">
        <div className="hero-copy"><span className="eyebrow">Malonogometna liga · Zagreb · od 1992.</span><h1>Igra koja <em>ostaje.</em></h1><p>Raspored, rezultati i priče iz lige u kojoj se ne broje samo golovi — nego prijateljstva, trud i prvi veliki sportski trenuci.</p><div className="hero-actions"><Link className="button" href="/raspored">Pogledaj raspored</Link><Link className="button button-outline" href="/uzrasti/2015">Rezultati i tablice</Link></div></div>
      </div>
      <div className="hero-stripe" aria-hidden="true">Tina Šport</div>
    </section>

    {league && <section id="aktualno" className="announcement-feature announcement-feature--league" aria-labelledby="league-announcement-title">
      <div className="shell announcement-grid">
        <Reveal className="announcement-visual announcement-visual--league">
          <div className="league-placeholder-mark" aria-hidden="true">26</div>
          <div className="league-poster-copy" aria-hidden="true"><span>Prijave su otvorene</span><strong>Nova sezona<br />26. 9. 2026.</strong><small>ŠC Hotanj · Zagrebački velesajam</small></div>
        </Reveal>
        <Reveal className="announcement-copy">
          <span className="eyebrow">Aktualno · 01</span>
          <h2 id="league-announcement-title">{league.title}</h2>
          <p>Malonogometna liga počinje 26. rujna u ŠC Hotanj na Zagrebačkom velesajmu.</p>
          <p>Liga je namijenjena nogometašima rođenima od 2015. do 2020. godine, a očekuju ih redovito natjecanje, kvalitetne utakmice i sportsko druženje.</p>
          <p className="announcement-lead">Prijavite svoju ekipu i budite dio ovogodišnje Malonogometne lige!</p>
          <p className="announcement-contact">Za prijave i dodatne informacije javite se na <Link href="/kontakt">mnl.tinasport@gmail.com</Link>.</p>
          <Link className="button announcement-button" href="/kontakt"><Mail size={17} aria-hidden="true" /> Prijave i informacije</Link>
        </Reveal>
      </div>
    </section>}

    {skradin && <section id="kup-skradina" className="announcement-feature announcement-feature--dark announcement-feature--reverse" aria-labelledby="skradin-announcement-title">
      <div className="shell announcement-grid">
        <Reveal className="announcement-copy">
          <span className="eyebrow">Aktualno · 02</span>
          <h2 id="skradin-announcement-title">{skradin.title}</h2>
          <p>Prijavite se na Kup grada Skradina, koji će se održati od 15. do 22. listopada u Skradinu.</p>
          <p>Očekuju vas uzbudljive utakmice, sportsko nadmetanje, dobro druženje i odlična atmosfera.</p>
          <p className="announcement-contact">Prijavite svoju ekipu na vrijeme na mail: <Link href="/kontakt">mnl.tinasport@gmail.com</Link>.</p>
          <Link className="button announcement-button" href="/kontakt"><Mail size={17} aria-hidden="true" /> Prijave i informacije</Link>
        </Reveal>
        <Reveal className="announcement-poster announcement-poster--placeholder" aria-label="Kup grada Skradina 2026">
          <span>Kup grada</span><strong>Skradina</strong><small>15. – 22. listopada 2026.</small>
        </Reveal>
      </div>
    </section>}

    <section id="skradin-galerija" className="section skradin-gallery-section" aria-label="Galerija Kupa grada Skradina"><div className="shell">
      <Reveal><SectionHeading eyebrow="Kup grada Skradina · Galerija" title="Skradin u srcu" copy="Smještaj, zajednički trenuci i atmosfera turnira koji ekipe pamte i nakon posljednjeg zvižduka." href="/galerija" linkLabel="Sve fotografije" /></Reveal>
      <div className="skradin-gallery">{skradinGallery.map((image, index) => <Reveal key={image.id} delay={index * .04} className="skradin-gallery-item"><Link href="/galerija" aria-label={`Otvori galeriju: ${image.alt}`}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 50vw, 30vw" /></Link></Reveal>)}</div>
    </div></section>

    <section id="raspored" className="section section-white"><div className="shell"><Reveal><SectionHeading eyebrow="Matchday" title="Raspored utakmica" copy="Sve važne informacije za dolazak na utakmicu — bez traženja po tablicama i objavama." href="/raspored" linkLabel="Cijeli raspored" /></Reveal>{fixtures.length ? <div className="match-grid">{fixtures.map((match, index) => <Reveal key={match.id} delay={index * .06}><MatchCard match={match} /></Reveal>)}</div> : <Reveal><CompetitionEmptyState /></Reveal>}</div></section>

    <section id="uzrasti" className="section section-navy age-section"><div className="shell"><Reveal><SectionHeading eyebrow="Generacije" title="Pronađi svoj uzrast" copy="Rezultati, aktualni poredak, strijelci i završnica na jednom mjestu." /></Reveal><Reveal><AgeNavigation /></Reveal></div></section>

    <section className="section section-white"><div className="shell"><Reveal><SectionHeading eyebrow="Iza rezultata" title="Trenuci koji se pamte" copy="Pogledajte atmosferu, ekipe i emocije koje čine Tina Šport–Pia ligu." href="/galerija" linkLabel="Otvori galeriju" /></Reveal><div className="gallery-preview">{galleryPreview.map((image) => <Link key={image.id} href="/galerija"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 60vw, 40vw" /><span><ArrowUpRight aria-hidden="true" /></span></Link>)}</div></div></section>
  </>;
}
