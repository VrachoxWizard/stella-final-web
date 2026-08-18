"use client";

import { useMemo, useState } from "react";
import { MatchCard } from "@/components/match-card";
import { ScorersList } from "@/components/scorers-list";
import { StandingsTable } from "@/components/standings-table";
import { aggregateScorers, calculateStandings } from "@/lib/competition";
import type { Match, Stage } from "@/lib/types";

type Tab = "overview" | "results" | "scorers" | Stage;

export function CompetitionView({ matches }: { matches: Match[] }) {
  const stages = useMemo(() => (["league", "playoff", "playout"] as Stage[]).filter((stage) => matches.some((match) => match.stage === stage)), [matches]);
  const [tab, setTab] = useState<Tab>("overview");
  const played = matches.filter((match) => match.status === "played");
  const stageMatches = stages.includes(tab as Stage) ? matches.filter((match) => match.stage === tab) : matches;
  const rows = calculateStandings(stageMatches);
  const scorers = aggregateScorers(matches);
  const labels: { value: Tab; label: string }[] = [
    { value: "overview", label: "Tablica" },
    { value: "results", label: "Rezultati" },
    { value: "scorers", label: "Strijelci" },
    ...(stages.includes("playoff") ? [{ value: "playoff" as Tab, label: "Playoff" }] : []),
    ...(stages.includes("playout") ? [{ value: "playout" as Tab, label: "Playout" }] : []),
  ];

  return <div>
    <div className="competition-tabs" role="tablist" aria-label="Podaci o natjecanju">
      {labels.map((item) => <button key={item.value} role="tab" aria-selected={tab === item.value} className={tab === item.value ? "active" : ""} onClick={() => setTab(item.value)}>{item.label}</button>)}
    </div>
    <div role="tabpanel" aria-live="polite">
      {tab === "overview" && <div className="stats-layout"><section className="stats-panel"><h3>Poredak</h3><StandingsTable rows={calculateStandings(matches.filter((match) => match.stage === "league"))} /></section><section className="stats-panel"><h3>Najbolji strijelci</h3><ScorersList scorers={scorers.slice(0, 7)} /></section></div>}
      {tab === "results" && <div className="results-grid">{played.map((match) => <MatchCard key={match.id} match={match} compact />)}{!played.length && <div className="empty-state">Još nema odigranih utakmica.</div>}</div>}
      {tab === "scorers" && <section className="stats-panel"><h3>Lista strijelaca</h3><ScorersList scorers={scorers} /></section>}
      {(tab === "playoff" || tab === "playout") && <div className="stats-layout"><section className="stats-panel"><h3>{tab === "playoff" ? "Playoff" : "Playout"} poredak</h3><StandingsTable rows={rows} /></section><div className="results-grid">{stageMatches.map((match) => <MatchCard key={match.id} match={match} compact />)}</div></div>}
    </div>
  </div>;
}
