"use client";

import { useMemo, useState } from "react";
import { MatchCard } from "@/components/match-card";
import type { Match } from "@/lib/types";

const fullDate = new Intl.DateTimeFormat("hr-HR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const shortDate = new Intl.DateTimeFormat("hr-HR", { day: "numeric", month: "short" });

export function ScheduleView({ matches }: { matches: Match[] }) {
  const [ageFilter, setAgeFilter] = useState("svi");
  const [dateFilter, setDateFilter] = useState("svi");
  const dates = useMemo(() => [...new Set(matches.map((match) => match.kickoff.slice(0, 10)))].sort(), [matches]);
  const filtered = matches.filter((match) => (ageFilter === "svi" || match.ageGroup === ageFilter) && (dateFilter === "svi" || match.kickoff.startsWith(dateFilter)));
  const groups = useMemo(() => {
    const result = new Map<string, Match[]>();
    filtered.forEach((match) => {
      const key = match.kickoff.slice(0, 10);
      result.set(key, [...(result.get(key) ?? []), match]);
    });
    return [...result.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return <>
    <div className="schedule-controls">
      <div className="filter-bar" aria-label="Filtriraj raspored po uzrastu">{[["svi", "Svi uzrasti"], ["2015", "2015"], ["2016", "2016"], ["2017", "2017"], ["2019", "2019"]].map(([value, label]) => <button key={value} type="button" aria-pressed={ageFilter === value} className={ageFilter === value ? "active" : ""} onClick={() => setAgeFilter(value)}>{label}</button>)}</div>
      <label className="date-filter"><span>Datum</span><select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}><option value="svi">Svi datumi</option>{dates.map((date) => <option key={date} value={date}>{shortDate.format(new Date(`${date}T12:00:00`))}</option>)}</select></label>
    </div>
    <div aria-live="polite"><p className="filter-summary">Prikazano utakmica: <strong>{filtered.length}</strong></p>{groups.map(([date, dateMatches]) => <section className="schedule-group" key={date}><div className="schedule-date"><h2>{fullDate.format(new Date(`${date}T12:00:00`))}</h2><span>{dateMatches.length} {dateMatches.length === 1 ? "utakmica" : "utakmice"}</span></div><div className="schedule-list">{dateMatches.map((match) => <MatchCard key={match.id} match={match} compact />)}</div></section>)}{!groups.length && <div className="empty-state">Nema utakmica za odabrane filtre.</div>}</div>
  </>;
}
