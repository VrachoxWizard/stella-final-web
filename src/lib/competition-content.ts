import path from "node:path";
import { z } from "zod";
import { listJson, parseJson, type ContentFiles } from "@/lib/content-files";
import { validateCompetitionIntegrity } from "@/lib/competition-validation";
import { ageGroupSchema, matchSchema, playerSchema, seasonSchema, teamSchema } from "@/lib/schemas";
import type { AgeGroup, CompetitionData, Match, Player, Season, Team } from "@/lib/types";

export const competitionFolders = {
  season: "competition/seasons",
  ageGroup: "competition/age-groups",
  team: "competition/teams",
  player: "competition/players",
  match: "competition/matches",
} as const;

export type CompetitionCollection = keyof typeof competitionFolders;

export function idFromReference(value: string) {
  return path.posix.basename(value.replaceAll("\\", "/")).replace(/\.json$/i, "");
}

/** References are stored as repo paths (the format TinaCMS used), so existing documents stay valid. */
export function referenceTo(collection: CompetitionCollection, id: string) {
  return `content/${competitionFolders[collection]}/${id}.json`;
}

function readCollection<T>(files: ContentFiles, collection: CompetitionCollection, schema: z.ZodType<T>): Array<T & { id: string }> {
  return listJson(files, competitionFolders[collection]).map(({ path: file, id, raw }) => {
    const parsed = schema.safeParse(parseJson(raw, file));
    if (!parsed.success) {
      throw new Error(`Dokument ${file} nije ispravan:\n${z.prettifyError(parsed.error)}`);
    }
    return { ...parsed.data, id };
  });
}

export function parseCompetitionFiles(files: ContentFiles): CompetitionData {
  const seasonDocuments = readCollection(files, "season", seasonSchema);
  const ageGroupDocuments = readCollection(files, "ageGroup", ageGroupSchema);
  const teamDocuments = readCollection(files, "team", teamSchema);
  const playerDocuments = readCollection(files, "player", playerSchema);
  const matchDocuments = readCollection(files, "match", matchSchema);

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
