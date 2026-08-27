import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { selectPublicMatches, validateCompetitionIntegrity } from "@/lib/competition-validation";
import type { AgeGroup, CompetitionData, Match, Season, Team } from "@/lib/types";

const season: Season = { id: "2026", name: "Sezona 2026", startDate: "2026-09-01", endDate: "2027-06-30", active: true, points: { win: 3, draw: 1, loss: 0 } };
const ageGroup: AgeGroup = { id: "2015", year: "2015", title: "Uzrast 2015", description: "Opis", sortOrder: 1, active: true };
const home: Team = { id: "home", name: "Domaćin", ageGroups: ["2015"], active: true };
const away: Team = { id: "away", name: "Gost", ageGroups: ["2015"], active: true };
const match = (overrides: Partial<Match> = {}): Match => ({ id: "match", title: "Domaćin – Gost", seasonId: "2026", ageGroup: "2015", stage: "league", round: "1. kolo", kickoff: "2026-09-19T10:00:00+02:00", venue: "Igralište", status: "scheduled", visibility: "draft", homeTeam: home, awayTeam: away, ...overrides });
const data = (matches: Match[], seasons = [season]): CompetitionData => ({ seasons, ageGroups: [ageGroup], teams: [home, away], players: [], matches });

describe("CMS competition validation", () => {
  it("starts only with confirmed age groups 2015–2020", () => {
    const directory = path.join(process.cwd(), "content", "competition", "age-groups");
    const years = readdirSync(directory).filter((name) => name.endsWith(".json")).sort().map((name) => JSON.parse(readFileSync(path.join(directory, name), "utf8")).year);
    expect(years).toEqual(["2015", "2016", "2017", "2018", "2019", "2020"]);
  });

  it("keeps drafts off the public web and sorts public matches by kickoff", () => {
    const later = match({ id: "later", visibility: "public", kickoff: "2026-09-20T10:00:00+02:00" });
    const earlier = match({ id: "earlier", visibility: "public", kickoff: "2026-09-19T10:00:00+02:00" });
    expect(selectPublicMatches(data([later, match(), earlier])).map(({ id }) => id)).toEqual(["earlier", "later"]);
  });

  it("rejects two active seasons, equal opponents and played matches without a result", () => {
    const secondSeason = { ...season, id: "2027", name: "Sezona 2027" };
    expect(() => validateCompetitionIntegrity(data([match({ status: "played", awayTeam: home })], [season, secondSeason]))).toThrow(/Samo jedna sezona|isti klub|nema potpun rezultat/);
  });

  it("accepts postponed, cancelled and played matches without scorer details", () => {
    expect(() => validateCompetitionIntegrity(data([
      match({ id: "postponed", status: "postponed" }),
      match({ id: "cancelled", status: "cancelled" }),
      match({ id: "played", status: "played", homeScore: 1, awayScore: 0 }),
    ]))).not.toThrow();
  });
});
