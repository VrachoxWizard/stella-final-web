import type { Match, ScorerTotal, StandingRow, Team } from "@/lib/types";

export type PointRules = { win: number; draw: number; loss: number };

const DEFAULT_POINTS: PointRules = { win: 3, draw: 1, loss: 0 };

export function calculateStandings(
  matches: Match[],
  teams: Team[] = [],
  points: PointRules = DEFAULT_POINTS,
): StandingRow[] {
  const rows = new Map<string, StandingRow>();

  const ensure = (team: Team) => {
    if (!rows.has(team.id)) {
      rows.set(team.id, {
        team,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      });
    }
    return rows.get(team.id)!;
  };

  teams.forEach(ensure);

  matches.filter((match) => match.status === "played").forEach((match) => {
    const home = ensure(match.homeTeam);
    const away = ensure(match.awayTeam);
    const homeScore = match.homeScore ?? 0;
    const awayScore = match.awayScore ?? 0;

    home.played += 1;
    away.played += 1;
    home.goalsFor += homeScore;
    home.goalsAgainst += awayScore;
    away.goalsFor += awayScore;
    away.goalsAgainst += homeScore;

    if (homeScore > awayScore) {
      home.wins += 1;
      away.losses += 1;
      home.points += points.win;
      away.points += points.loss;
    } else if (homeScore < awayScore) {
      away.wins += 1;
      home.losses += 1;
      away.points += points.win;
      home.points += points.loss;
    } else {
      home.draws += 1;
      away.draws += 1;
      home.points += points.draw;
      away.points += points.draw;
    }
  });

  return [...rows.values()]
    .map((row) => ({ ...row, goalDifference: row.goalsFor - row.goalsAgainst }))
    .sort((a, b) =>
      b.points - a.points ||
      b.goalDifference - a.goalDifference ||
      b.goalsFor - a.goalsFor ||
      a.team.name.localeCompare(b.team.name, "hr"),
    );
}

export function aggregateScorers(matches: Match[]): ScorerTotal[] {
  const totals = new Map<string, ScorerTotal>();
  matches.filter((match) => match.status === "played").forEach((match) => {
    match.scorers?.forEach((entry) => {
      const key = entry.playerId ?? `${entry.playerName}-${entry.teamId}`;
      const team = match.homeTeam.id === entry.teamId ? match.homeTeam : match.awayTeam;
      const current = totals.get(key);
      totals.set(key, current ? { ...current, goals: current.goals + entry.goals } : { ...entry, team });
    });
  });
  return [...totals.values()].sort((a, b) => b.goals - a.goals || a.playerName.localeCompare(b.playerName, "hr"));
}
