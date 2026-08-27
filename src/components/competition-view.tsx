"use client";

import { useMemo, useState } from "react";
import { CompetitionEmptyState } from "@/components/competition-empty-state";
import { MatchCard } from "@/components/match-card";
import { ScorersList } from "@/components/scorers-list";
import { StandingsTable } from "@/components/standings-table";
import { aggregateScorers, calculateStandings } from "@/lib/competition";
import type { Match, PointRules, Stage } from "@/lib/types";

type Tab = "schedule" | "overview" | "results" | "scorers" | Stage;

export function CompetitionView({ matches, points }: { matches: Match[]; points?: PointRules }) {
  const stages = useMemo(() => (["league", "playoff", "playout"] as Stage[]).filter((stage) => matches.some((match) => match.stage === stage)), [matches]);
  const [tab, setTab] = useState<Tab>("schedule");
  const played = matches.filter((match) => match.status === "played");
  const scorers = aggregateScorers(matches);
  const stageMatches = stages.includes(tab as Stage) ? matches.filter((match) => match.stage === tab) : matches;
  const rows = calculateStandings(stageMatches, [], points);
  const labels: { value: Tab; label: string }[] = [
    { value: "schedule", label: "Raspored" },
    ...(played.length ? [{ value: "overview" as Tab, label: "Tablica" }, { value: "results" as Tab, label: "Rezultati" }] : []),
    ...(scorers.length ? [{ value: "scorers" as Tab, label: "Strijelci" }] : []),
    ...(stages.includes("playoff") ? [{ value: "playoff" as Tab, label: "Playoff" }] : []),
    ...(stages.includes("playout") ? [{ value: "playout" as Tab, label: "Playout" }] : []),
  ];

  if (!matches.length) return <CompetitionEmptyState />;

  return <div>
    <div className="competition-tabs" role="tablist" aria-label="Podaci o natjecanju">
      {labels.map((item) => <button key={item.value} role="tab" aria-selected={tab === item.value} className={tab === item.value ? "active" : ""} onClick={() => setTab(item.value)}>{item.label}</button>)}
    </div>
    <div role="tabpanel" aria-live="polite">
      {tab === "schedule" && <div className="results-grid">{matches.map((match) => <MatchCard key={match.id} match={match} compact />)}</div>}
      {tab === "overview" && played.length > 0 && <div className={`stats-layout${scorers.length ? "" : " single"}`}>
        <section className="stats-panel"><h3>Poredak</h3><StandingsTable rows={calculateStandings(matches.filter((match) => match.stage === "league"), [], points)} /></section>
        {scorers.length > 0 && <section className="stats-panel"><h3>Najbolji strijelci</h3><ScorersList scorers={scorers.slice(0, 7)} /></section>}
      </div>}
      {tab === "results" && played.length > 0 && <div className="results-grid">{played.map((match) => <MatchCard key={match.id} match={match} compact />)}</div>}
      {tab === "scorers" && scorers.length > 0 && <section className="stats-panel"><h3>Lista strijelaca</h3><ScorersList scorers={scorers} /></section>}
      {(tab === "playoff" || tab === "playout") && <div className="stats-layout"><section className="stats-panel"><h3>{tab === "playoff" ? "Playoff" : "Playout"} poredak</h3><StandingsTable rows={rows} /></section><div className="results-grid">{stageMatches.map((match) => <MatchCard key={match.id} match={match} compact />)}</div></div>}
    </div>
  </div>;
}
