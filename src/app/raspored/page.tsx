import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ScheduleView } from "@/components/schedule-view";
import { getMatches } from "@/lib/content";

export const metadata: Metadata = { title: "Raspored utakmica", description: "Objavljeni raspored Tina Šport–Pia lige po datumima i uzrastima.", alternates: { canonical: "/raspored" } };

export default async function SchedulePage() {
  const matches = await getMatches();
  const scheduled = matches.filter((match) => match.status !== "played");
  const events = scheduled.map((match) => ({ "@type": "SportsEvent", name: `${match.homeTeam.name} – ${match.awayTeam.name}`, startDate: match.kickoff, eventStatus: match.status === "scheduled" ? "https://schema.org/EventScheduled" : "https://schema.org/EventPostponed", location: { "@type": "Place", name: match.venue, address: { "@type": "PostalAddress", addressLocality: "Zagreb", addressCountry: "HR" } }, competitor: [{ "@type": "SportsTeam", name: match.homeTeam.name }, { "@type": "SportsTeam", name: match.awayTeam.name }] }));
  return <><PageHero eyebrow="Proljetni dio · 2026" title="Raspored" copy="Teren, vrijeme i protivnik — sve što vam treba za sljedeći matchday." word="Igra" image="/images/pexels-sergio-souza-9735734.jpg" /><section className="section"><div className="shell"><ScheduleView matches={scheduled} /></div></section><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(events) }} /></>;
}
