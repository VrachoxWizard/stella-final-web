import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { AgeNavigation } from "@/components/age-navigation";
import { MatchCard } from "@/components/match-card";
import { MatchdayFilm } from "@/components/matchday-film";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SponsorCard } from "@/components/sponsor-card";
import { rastaneGallery } from "@/lib/data";
import { getAnnouncements, getGallery, getMatches, getSponsor } from "@/lib/content";

const heroDate = new Intl.DateTimeFormat("hr-HR", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function HomePage() {
  const [matches, announcements, gallery, sponsor] = await Promise.all([getMatches(), getAnnouncements(), getGallery(), getSponsor()]);
  const fixtures = matches.filter((match) => match.status === "scheduled").slice(0, 3);
  const featured = fixtures[0];
  const rastane = announcements.find((item) => item.id === "rastane-2026") ?? announcements.find((item) => item.type === "tournament");
  const trnovcica = announcements.find((item) => item.id === "trnovcica-proljece") ?? announcements.find((item) => item.type === "notice");

  return <>
    <section className="hero">
      <div className="hero-media"><Image src="/images/Naslovna-fotka-2.jpg" alt="" fill sizes="100vw" preload /></div>
      <div className="shell hero-grid">
        <div className="hero-copy"><span className="eyebrow">Malonogometna liga · Zagreb · od 1992.</span><h1>Igra koja <em>ostaje.</em></h1><p>Raspored, rezultati i priče iz lige u kojoj se ne broje samo golovi — nego prijateljstva, trud i prvi veliki sportski trenuci.</p><div className="hero-actions"><Link className="button" href="/raspored">Pogledaj raspored</Link><Link className="button button-outline" href="/uzrasti/2015">Rezultati i tablice</Link></div></div>
        {featured && <aside className="hero-ticket" aria-label="Izdvojena utakmica"><div className="ticket-top"><span>Matchday</span><span>Uzrast {featured.ageGroup}</span></div><div className="ticket-body"><span className="ticket-date">{heroDate.format(new Date(featured.kickoff))}</span><div className="ticket-teams"><span>{featured.homeTeam.name}</span><b>VS</b><span>{featured.awayTeam.name}</span></div><span className="ticket-location"><MapPin size={15} />{featured.venue}</span></div></aside>}
      </div>
      <div className="hero-stripe" aria-hidden="true">Tina Šport</div>
    </section>
    <div className="ticker" aria-hidden="true"><div className="ticker-track">{[...Array(2)].flatMap((_, group) => ["Sljedeće kolo · SC Trnovčica", "Igraj srcem", "Raspored je objavljen", "Za ekipu. Za uspomene."].map((text, index) => <span key={`${group}-${index}`}>{text}</span>))}</div></div>

    <section className="section section-white"><div className="shell"><Reveal><SectionHeading eyebrow="Matchday" title="Sljedeće na rasporedu" copy="Sve važne informacije za dolazak na utakmicu — bez traženja po tablicama i objavama." href="/raspored" linkLabel="Cijeli raspored" /></Reveal><div className="match-grid">{fixtures.map((match, index) => <Reveal key={match.id} delay={index * .06}><MatchCard match={match} /></Reveal>)}</div></div></section>

    <section className="section section-navy age-section"><div className="shell"><Reveal><SectionHeading eyebrow="Generacije" title="Pronađi svoj uzrast" copy="Rezultati, aktualni poredak, strijelci i završnica na jednom mjestu." /></Reveal><Reveal><AgeNavigation /></Reveal></div></section>

    <MatchdayFilm />

    {rastane && <section className="rastane-story">
      <div className="rastane-poster"><Image src={rastane.image} alt="Službena najava Raštane kupa 2026" fill sizes="(max-width: 900px) 100vw, 44vw" /></div>
      <div className="rastane-content"><Reveal><span className="eyebrow">Aktualno</span><h2>{rastane.title}</h2><p>{rastane.excerpt}</p>{rastane.cta && <Link className="button" href={rastane.cta.href}>{rastane.cta.label}</Link>}</Reveal><div className="rastane-mosaic">{rastaneGallery.map((image, index) => <Reveal key={image.id} delay={index * .04} className="rastane-tile"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 50vw, 18vw" /></Reveal>)}</div></div>
    </section>}

    <section className="section section-navy sponsor-section"><div className="shell"><Reveal><SponsorCard sponsor={sponsor} /></Reveal></div></section>

    {trnovcica && <section className="community-feature"><Reveal className="community-copy"><span className="eyebrow">Lokalna zajednica</span><h2>{trnovcica.title}</h2><p>{trnovcica.excerpt}</p>{trnovcica.cta && <Link className="button" href={trnovcica.cta.href}>{trnovcica.cta.label}</Link>}</Reveal><div className="community-image"><Image src={trnovcica.image} alt="Večernja utakmica mladih nogometaša na terenu DSR Trnovčica" fill sizes="(max-width: 760px) 100vw, 52vw" /></div></section>}

    <section className="section section-white"><div className="shell"><Reveal><SectionHeading eyebrow="Iza rezultata" title="Trenuci koji se pamte" copy="Pogledajte atmosferu, ekipe i emocije koje čine Tina Šport–Pia ligu." href="/galerija" linkLabel="Otvori galeriju" /></Reveal><div className="gallery-preview">{gallery.slice(0, 5).map((image) => <Link key={image.id} href="/galerija"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 60vw, 40vw" /><span><ArrowUpRight aria-hidden="true" /></span></Link>)}</div></div></section>
  </>;
}
