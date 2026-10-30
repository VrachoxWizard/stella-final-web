import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { AgeNavigation } from "@/components/age-navigation";
import { CompetitionEmptyState } from "@/components/competition-empty-state";
import { MatchCard } from "@/components/match-card";
import { Reveal } from "@/components/reveal";
import { Lines, RichText } from "@/components/rich-text";
import { SectionHeading } from "@/components/section-heading";
import { getAnnouncements, getGallery, getMatches, getSite } from "@/lib/content";
import type { Announcement } from "@/lib/types";

function AnnouncementSection({ item, index, email }: { item: Announcement; index: number; email: string }) {
  const dark = item.style === "dark";
  const sectionId = index === 0 ? "aktualno" : item.id;
  const titleId = `${item.id}-title`;
  const hasPosterText = Boolean(item.posterTop || item.posterTitle || item.posterBottom);

  const copy = <Reveal className="announcement-copy">
    <span className="eyebrow">Aktualno · {String(index + 1).padStart(2, "0")}</span>
    <h2 id={titleId}>{item.title}</h2>
    <RichText text={item.text} />
    {item.highlight && <p className="announcement-lead">{item.highlight}</p>}
    {item.contactText && <p className="announcement-contact">{item.contactText} <Link href="/kontakt">{email}</Link>.</p>}
    {item.buttonLabel && item.buttonLink && <Link className="button announcement-button" href={item.buttonLink}><Mail size={17} aria-hidden="true" /> {item.buttonLabel}</Link>}
  </Reveal>;

  const visual = dark
    ? item.image
      ? <Reveal className="announcement-poster"><Image src={item.image.src} width={item.image.width} height={item.image.height} alt={item.title} sizes="(max-width: 760px) 100vw, 470px" /></Reveal>
      : <Reveal className="announcement-poster announcement-poster--placeholder">
        {item.posterTop && <span>{item.posterTop}</span>}<strong><Lines text={item.posterTitle || item.title} /></strong>{item.posterBottom && <small>{item.posterBottom}</small>}
      </Reveal>
    : <Reveal className="announcement-visual announcement-visual--league">
      {item.image && <Image src={item.image.src} alt={item.title} fill sizes="(max-width: 760px) 100vw, 45vw" />}
      {item.posterNumber && <div className="league-placeholder-mark" aria-hidden="true">{item.posterNumber}</div>}
      {hasPosterText && <div className="league-poster-copy" aria-hidden="true">{item.posterTop && <span>{item.posterTop}</span>}{item.posterTitle && <strong><Lines text={item.posterTitle} /></strong>}{item.posterBottom && <small>{item.posterBottom}</small>}</div>}
    </Reveal>;

  return <section id={sectionId} className={`announcement-feature ${dark ? "announcement-feature--dark announcement-feature--reverse" : "announcement-feature--league"}`} aria-labelledby={titleId}>
    <div className="shell announcement-grid">{dark ? <>{copy}{visual}</> : <>{visual}{copy}</>}</div>
  </section>;
}

export default async function HomePage() {
  const [matches, announcements, gallery, site] = await Promise.all([getMatches(), getAnnouncements(), getGallery(), getSite()]);
  const { hero, featuredGallery, schedule, ageGroups, gallery: galleryHeading } = site.home;
  const fixtures = matches.filter((match) => match.status === "scheduled").slice(0, 3);
  const featuredImages = gallery.filter((image) => image.featured);
  const galleryPreview = gallery.filter((image) => image.homepage).slice(0, 5);

  return <>
    <section className="hero">
      <div className="hero-media hero-media--placeholder" aria-hidden="true" />
      <div className="shell hero-grid">
        <div className="hero-copy">{hero.eyebrow && <span className="eyebrow">{hero.eyebrow}</span>}<h1>{hero.title}{hero.titleHighlight && <> <em>{hero.titleHighlight}</em></>}</h1>{hero.text && <p>{hero.text}</p>}<div className="hero-actions"><Link className="button" href={hero.primaryButton.href}>{hero.primaryButton.label}</Link><Link className="button button-outline" href={hero.secondaryButton.href}>{hero.secondaryButton.label}</Link></div></div>
      </div>
      <div className="hero-stripe" aria-hidden="true">Tina Šport</div>
    </section>

    {announcements.map((item, index) => <AnnouncementSection key={item.id} item={item} index={index} email={site.settings.email} />)}

    {featuredGallery.show && featuredImages.length > 0 && <section id="skradin-galerija" className="section skradin-gallery-section" aria-label={featuredGallery.title}><div className="shell">
      <Reveal><SectionHeading eyebrow={featuredGallery.eyebrow} title={featuredGallery.title} copy={featuredGallery.text} href="/galerija" linkLabel="Sve fotografije" /></Reveal>
      <div className="skradin-gallery">{featuredImages.map((image, index) => <Reveal key={image.id} delay={index * .04} className="skradin-gallery-item"><Link href="/galerija" aria-label={`Otvori galeriju: ${image.alt}`}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 50vw, 30vw" /></Link></Reveal>)}</div>
    </div></section>}

    <section id="raspored" className="section section-white"><div className="shell"><Reveal><SectionHeading eyebrow={schedule.eyebrow} title={schedule.title} copy={schedule.text} href="/raspored" linkLabel="Cijeli raspored" /></Reveal>{fixtures.length ? <div className="match-grid">{fixtures.map((match, index) => <Reveal key={match.id} delay={index * .06}><MatchCard match={match} /></Reveal>)}</div> : <Reveal><CompetitionEmptyState content={site.pages.emptySchedule} /></Reveal>}</div></section>

    <section id="uzrasti" className="section section-navy age-section"><div className="shell"><Reveal><SectionHeading eyebrow={ageGroups.eyebrow} title={ageGroups.title} copy={ageGroups.text} /></Reveal><Reveal><AgeNavigation /></Reveal></div></section>

    {galleryPreview.length > 0 && <section className="section section-white"><div className="shell"><Reveal><SectionHeading eyebrow={galleryHeading.eyebrow} title={galleryHeading.title} copy={galleryHeading.text} href="/galerija" linkLabel="Otvori galeriju" /></Reveal><div className="gallery-preview">{galleryPreview.map((image) => <Link key={image.id} href="/galerija"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 60vw, 40vw" /><span><ArrowUpRight aria-hidden="true" /></span></Link>)}</div></div></section>}
  </>;
}
