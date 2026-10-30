import type { Metadata } from "next";
import { CompetitionEmptyState } from "@/components/competition-empty-state";
import { PageHero } from "@/components/page-hero";
import { ScheduleView } from "@/components/schedule-view";
import { getMatches, getSite } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSite();
  return { title: "Raspored utakmica", description: `Objavljeni raspored ${settings.name} lige po datumima i uzrastima.`, alternates: { canonical: "/raspored" } };
}

export default async function SchedulePage() {
  const [matches, { pages }] = await Promise.all([getMatches(), getSite()]);
  const hero = pages.schedule;
  const scheduled = matches.filter((match) => match.status !== "played");
  const events = scheduled.map((match) => ({ "@type": "SportsEvent", name: `${match.homeTeam.name} – ${match.awayTeam.name}`, startDate: match.kickoff, eventStatus: match.status === "scheduled" ? "https://schema.org/EventScheduled" : match.status === "cancelled" ? "https://schema.org/EventCancelled" : "https://schema.org/EventPostponed", location: { "@type": "Place", name: match.venue, address: { "@type": "PostalAddress", addressLocality: "Zagreb", addressCountry: "HR" } }, competitor: [{ "@type": "SportsTeam", name: match.homeTeam.name }, { "@type": "SportsTeam", name: match.awayTeam.name }] }));
  return <><PageHero eyebrow={hero.eyebrow} title={hero.title} copy={hero.text} word={hero.word} /><section className="section"><div className="shell">{scheduled.length ? <ScheduleView matches={scheduled} /> : <CompetitionEmptyState content={pages.emptySchedule} />}</div></section>{events.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(events).replace(/</g, "\u003c") }} />}</>;
}
