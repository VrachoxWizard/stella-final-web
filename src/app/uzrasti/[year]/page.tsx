import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AgeNavigation } from "@/components/age-navigation";
import { CompetitionView } from "@/components/competition-view";
import { PageHero } from "@/components/page-hero";
import { ageGroups } from "@/lib/data";
import { getMatches } from "@/lib/content";

type Props = { params: Promise<{ year: string }> };

export function generateStaticParams() { return ageGroups.map(({ year }) => ({ year })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  const group = ageGroups.find((item) => item.year === year);
  if (!group) return {};
  return { title: group.title, description: group.description, alternates: { canonical: `/uzrasti/${year}` } };
}

export default async function AgeGroupPage({ params }: Props) {
  const { year } = await params;
  const group = ageGroups.find((item) => item.year === year);
  if (!group) notFound();
  const matches = await getMatches();
  const groupMatches = matches.filter((match) => match.ageGroup === year);
  return <><PageHero eyebrow="Sezona 2026" title={`Uzrast ${year}`} copy={group.description} word={year} image="/images/WhatsApp-Image-2026-02-09-at-20.58.08.jpeg" /><section className="section"><div className="shell"><div className="competition-intro"><div><span className="eyebrow">Natjecanje</span><h2>Sve na jednom mjestu.</h2><p>Tablica se automatski izračunava iz odigranih susreta. Odgođene i neodigrane utakmice ne utječu na poredak.</p></div><AgeNavigation active={year} /></div><CompetitionView matches={groupMatches} /></div></section></>;
}
