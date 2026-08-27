import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { validateCompetitionIntegrity } from "@/lib/competition-validation";
import type { AgeGroup, CompetitionData, Match, Player, Season, Team } from "@/lib/types";

const contentRoot = path.join(process.cwd(), "content", "competition");
const reference = z.string().min(1);
const nonNegativeInteger = z.number().int().nonnegative();

const seasonSchema = z.object({
  name: z.string().min(1),
  startDate: z.string().date(),
  endDate: z.string().date(),
  active: z.boolean(),
  pointsWin: nonNegativeInteger,
  pointsDraw: nonNegativeInteger,
  pointsLoss: nonNegativeInteger,
});

const ageGroupSchema = z.object({
  year: z.string().regex(/^20\d{2}$/),
  title: z.string().min(1),
  description: z.string().min(1),
  sortOrder: z.number().int().nonnegative(),
  active: z.boolean(),
});

const teamSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1).optional(),
  crest: z.string().min(1).optional(),
  ageGroups: z.array(z.object({ ageGroup: reference })).min(1),
  active: z.boolean(),
});

const playerSchema = z.object({
  displayName: z.string().min(1),
  team: reference,
  ageGroup: reference,
  active: z.boolean(),
});

const scorerSchema = z.object({
  player: reference.optional(),
  playerName: z.string().min(1).optional(),
  team: reference,
  goals: z.number().int().positive(),
}).refine((scorer) => Boolean(scorer.player || scorer.playerName), { message: "Odaberite igrača ili upišite ime strijelca." });

const matchSchema = z.object({
  title: z.string().min(1),
  season: reference,
  ageGroup: reference,
  stage: z.enum(["league", "playoff", "playout"]),
  round: z.string().min(1),
  kickoff: z.string().datetime({ offset: true }),
  venue: z.string().min(1),
  homeTeam: reference,
  awayTeam: reference,
  status: z.enum(["scheduled", "played", "postponed", "cancelled"]),
  homeScore: nonNegativeInteger.optional(),
  awayScore: nonNegativeInteger.optional(),
  scorers: z.array(scorerSchema).optional(),
  visibility: z.enum(["draft", "public"]),
});

function idFromReference(value: string) {
  return path.posix.basename(value.replaceAll("\\", "/")).replace(/\.json$/i, "");
}

async function readCollection<T>(folder: string, schema: z.ZodType<T>): Promise<Array<T & { id: string }>> {
  const directory = path.join(contentRoot, folder);
  let filenames: string[];
  try {
    filenames = (await readdir(directory)).filter((name) => name.endsWith(".json")).sort();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  return Promise.all(filenames.map(async (filename) => {
    const absolutePath = path.join(directory, filename);
    let raw: unknown;
    try {
      raw = JSON.parse(await readFile(absolutePath, "utf8"));
    } catch (error) {
      throw new Error(`CMS dokument ${path.relative(process.cwd(), absolutePath)} nije ispravan JSON.`, { cause: error });
    }
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`CMS dokument ${path.relative(process.cwd(), absolutePath)} nije ispravan:\n${z.prettifyError(parsed.error)}`);
    }
    return { ...parsed.data, id: filename.replace(/\.json$/i, "") };
  }));
}

export async function loadCompetitionData(): Promise<CompetitionData> {
  const [seasonDocuments, ageGroupDocuments, teamDocuments, playerDocuments, matchDocuments] = await Promise.all([
    readCollection("seasons", seasonSchema),
    readCollection("age-groups", ageGroupSchema),
    readCollection("teams", teamSchema),
    readCollection("players", playerSchema),
    readCollection("matches", matchSchema),
  ]);

  const seasons: Season[] = seasonDocuments.map(({ id, name, startDate, endDate, active, pointsWin, pointsDraw, pointsLoss }) => ({
    id, name, startDate, endDate, active,
    points: { win: pointsWin, draw: pointsDraw, loss: pointsLoss },
  }));
  const ageGroups: AgeGroup[] = ageGroupDocuments.map((document) => ({ ...document })).sort((a, b) => a.sortOrder - b.sortOrder || a.year.localeCompare(b.year));
  const teams: Team[] = teamDocuments.map(({ id, name, shortName, crest, ageGroups: groups, active }) => ({
    id, name, shortName, crest, active, ageGroups: groups.map(({ ageGroup }) => idFromReference(ageGroup)),
  }));
  const players: Player[] = playerDocuments.map(({ id, displayName, team, ageGroup, active }) => ({
    id, displayName, teamId: idFromReference(team), ageGroup: idFromReference(ageGroup), active,
  }));
  const teamMap = new Map(teams.map((team) => [team.id, team]));
  const playerMap = new Map(players.map((player) => [player.id, player]));
  const matches: Match[] = matchDocuments.map((document) => {
    const homeId = idFromReference(document.homeTeam);
    const awayId = idFromReference(document.awayTeam);
    const placeholder = (id: string): Team => ({ id, name: id, ageGroups: [], active: false });
    return {
      id: document.id,
      title: document.title,
      seasonId: idFromReference(document.season),
      ageGroup: idFromReference(document.ageGroup),
      stage: document.stage,
      round: document.round,
      kickoff: document.kickoff,
      venue: document.venue,
      status: document.status,
      visibility: document.visibility,
      homeTeam: teamMap.get(homeId) ?? placeholder(homeId),
      awayTeam: teamMap.get(awayId) ?? placeholder(awayId),
      homeScore: document.homeScore,
      awayScore: document.awayScore,
      scorers: document.scorers?.map((scorer) => {
        const playerId = scorer.player ? idFromReference(scorer.player) : undefined;
        return {
          playerId,
          playerName: scorer.playerName ?? (playerId ? playerMap.get(playerId)?.displayName : undefined) ?? "Nepoznati igrač",
          teamId: idFromReference(scorer.team),
          goals: scorer.goals,
        };
      }),
    };
  });

  return validateCompetitionIntegrity({ seasons, ageGroups, teams, players, matches });
}
