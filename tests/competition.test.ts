import { describe, expect, it } from "vitest";
import { aggregateScorers, calculateStandings } from "@/lib/competition";
import type { Match, Team } from "@/lib/types";

const a: Team = { id: "a", name: "Alfa" };
const b: Team = { id: "b", name: "Beta" };
const c: Team = { id: "c", name: "Cedar" };
const game = (id: string, homeTeam: Team, awayTeam: Team, homeScore?: number, awayScore?: number, status: Match["status"] = "played", stage: Match["stage"] = "league"): Match => ({ id, ageGroup: "2015", stage, round: "1", kickoff: "2026-03-01T10:00:00+01:00", venue: "Test", status, homeTeam, awayTeam, homeScore, awayScore });

describe("calculateStandings", () => {
  it("calculates wins, draws, losses, goals and points", () => {
    const rows = calculateStandings([game("1", a, b, 2, 1), game("2", b, c, 0, 0), game("3", c, a, 3, 1)]);
    expect(rows.map((row) => [row.team.id, row.points])).toEqual([["c", 4], ["a", 3], ["b", 1]]);
    expect(rows[0]).toMatchObject({ played: 2, wins: 1, draws: 1, losses: 0, goalsFor: 3, goalsAgainst: 1, goalDifference: 2 });
  });

  it("ignores scheduled, postponed, and cancelled matches", () => {
    const rows = calculateStandings([game("1", a, b, 8, 0, "scheduled"), game("2", a, b, 2, 0, "postponed"), game("3", a, b, 1, 0, "cancelled")], [a, b]);
    expect(rows.every((row) => row.played === 0 && row.points === 0)).toBe(true);
  });

  it("uses points, goal difference, goals scored, then Croatian team name", () => {
    const rows = calculateStandings([game("1", a, b, 2, 0), game("2", c, a, 3, 1), game("3", b, c, 2, 0)]);
    expect(rows.map((row) => row.team.id)).toEqual(["a", "c", "b"]);
  });

  it("keeps stages separate when callers filter them", () => {
    const games = [game("1", a, b, 2, 0, "played", "league"), game("2", b, a, 5, 0, "played", "playoff")];
    expect(calculateStandings(games.filter((item) => item.stage === "league"))[0].team.id).toBe("a");
    expect(calculateStandings(games.filter((item) => item.stage === "playoff"))[0].team.id).toBe("b");
  });

  it("supports empty competitions and configurable scoring", () => {
    expect(calculateStandings([])).toEqual([]);
    expect(calculateStandings([game("1", a, b, 1, 1)], [], { win: 2, draw: 2, loss: 0 }).map((row) => row.points)).toEqual([2, 2]);
  });
});

describe("aggregateScorers", () => {
  it("aggregates repeated scorer entries only from played matches", () => {
    const first = { ...game("1", a, b, 2, 0), scorers: [{ playerId: "p1", playerName: "Igrač A", teamId: "a", goals: 2 }] };
    const second = { ...game("2", a, c, 1, 0), scorers: [{ playerId: "p1", playerName: "Igrač A", teamId: "a", goals: 1 }] };
    const future = { ...game("3", a, b, 4, 0, "scheduled"), scorers: [{ playerId: "p1", playerName: "Igrač A", teamId: "a", goals: 4 }] };
    expect(aggregateScorers([first, second, future])).toMatchObject([{ playerName: "Igrač A", goals: 3, team: a }]);
  });
});
