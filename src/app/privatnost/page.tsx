import type { Metadata } from "next";
import { Fragment } from "react";
import { PageHero } from "@/components/page-hero";
import { RichText } from "@/components/rich-text";
import { getSite } from "@/lib/content";

export const metadata: Metadata = { title: "Privatnost", description: "Informacije o privatnosti i obradi osobnih podataka.", alternates: { canonical: "/privatnost" } };

export default async function PrivacyPage() {
  const { privacy } = await getSite();
  return <><PageHero eyebrow={privacy.hero.eyebrow} title={privacy.hero.title} copy={privacy.hero.text} word={privacy.hero.word} /><section className="section section-white"><article className="shell legal">
    {privacy.updated && <p><strong>Posljednje ažuriranje:</strong> {privacy.updated}</p>}
    <RichText text={privacy.intro} />
    {privacy.sections.map((section, index) => <Fragment key={index}><h2>{section.title}</h2><RichText text={section.text} /></Fragment>)}
  </article></section></>;
}
