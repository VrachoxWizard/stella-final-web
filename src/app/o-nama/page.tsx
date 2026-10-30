import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { RichText } from "@/components/rich-text";
import { getSite } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSite();
  return { title: "O nama", description: `Priča o ${settings.name} ligi, koja od 1992. okuplja mlade nogometaše.`, alternates: { canonical: "/o-nama" } };
}

export default async function AboutPage() {
  const { about, settings } = await getSite();
  return <><PageHero eyebrow={about.hero.eyebrow} title={about.hero.title} copy={about.hero.text} word={about.hero.word} /><section className="section section-white"><div className="shell story-grid">
    <aside className="story-sticky">{about.eyebrow && <span className="eyebrow">{about.eyebrow}</span>}<h2>{about.heading}</h2><div className="story-media"><Image src={about.image.src} alt={about.image.alt} fill sizes="(max-width: 760px) 100vw, 38vw" /></div><div className="organizer-note"><span>Organizator lige</span><strong>{settings.organizer}</strong><small>{settings.name} · Zagreb</small></div></aside>
    <article className="story-copy"><RichText text={about.text} />{about.quote && <blockquote className="quote">“{about.quote}”</blockquote>}<RichText text={about.textAfterQuote} />{about.values.length > 0 && <div className="values-grid">{about.values.map((value, index) => <div className="value-card" key={index}><span>{String(index + 1).padStart(2, "0")}</span><h3>{value.title}</h3>{value.text && <p>{value.text}</p>}</div>)}</div>}</article>
  </div></section></>;
}
