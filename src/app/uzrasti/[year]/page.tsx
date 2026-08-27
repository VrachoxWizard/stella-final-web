import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AgeNavigation } from "@/components/age-navigation";
import { CompetitionView } from "@/components/competition-view";
import { PageHero } from "@/components/page-hero";
import { getActiveSeason, getAgeGroups, getMatches } from "@/lib/content";

type Props = { params: Promise<{ year: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAgeGroups()).map(({ year }) => ({ year }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  const group = (await getAgeGroups()).find((item) => item.year === year);
  if (!group) return {};
  return { title: group.title, description: group.description, alternates: { canonical: `/uzrasti/${year}` } };
}

export default async function AgeGroupPage({ params }: Props) {
  const { year } = await params;
  const [ageGroups, matches, activeSeason] = await Promise.all([getAgeGroups(), getMatches(), getActiveSeason()]);
  const group = ageGroups.find((item) => item.year === year);
  if (!group) notFound();
  const groupMatches = matches.filter((match) => match.ageGroup === group.id);

  return <>
    <PageHero eyebrow={activeSeason?.name ?? "Malonogometna liga"} title={`Uzrast ${year}`} copy={group.description} word={year} image="/images/WhatsApp-Image-2026-02-09-at-20.58.08.jpeg" />
    <section className="section"><div className="shell">
      <div className="competition-intro"><div><span className="eyebrow">Natjecanje</span><h2>Sve na jednom mjestu.</h2><p>Raspored, rezultati, poredak i strijelci prikazuju se čim službeni podaci budu objavljeni.</p></div><AgeNavigation active={year} /></div>
      <CompetitionView matches={groupMatches} points={activeSeason?.points} />
    </div></section>
  </>;
}
