"use server";

import { z } from "zod";
import { competitionFolders, parseCompetitionFiles, referenceTo, type CompetitionCollection } from "@/lib/competition-content";
import { checked, formImageSchema, jsonChange, readRawPayload, saveContent, storeImage, UserError, type ActionResult } from "@/lib/cms/save";
import type { FileChange, Snapshot } from "@/lib/cms/store";
import { uniqueId, zagrebIso } from "@/lib/cms/utils";
import { ageGroupSchema, matchSchema, playerSchema, seasonSchema, teamSchema } from "@/lib/schemas";
import type { Season } from "@/lib/types";

const idSchema = z.string().regex(/^[\w-]+$/, "Neispravan zapis.");
const docPath = (collection: CompetitionCollection, id: string) => `content/${competitionFolders[collection]}/${id}.json`;
const data = (snapshot: Snapshot) => parseCompetitionFiles(snapshot.files);
const savedAt = (base: string, id: string) => `${base}/${id}?spremljeno=1`;

function existingId(id: string | null, ids: string[], label: string) {
  if (id === null) return null;
  const valid = idSchema.parse(id);
  if (!ids.includes(valid)) throw new UserError(`${label} više ne postoji. Vratite se na popis i osvježite stranicu.`);
  return valid;
}

function deleteDocument(collection: CompetitionCollection, id: string, label: string, redirectTo: string, usage: (snapshot: Snapshot, id: string) => string[]) {
  return saveContent({
    message: `obrisano – ${label}`,
    redirectTo,
    build: (snapshot) => {
      const valid = idSchema.parse(id);
      const used = usage(snapshot, valid);
      if (used.length) throw new UserError(`Ne može se obrisati jer se još koristi: ${used.slice(0, 5).join(", ")}${used.length > 5 ? ` i još ${used.length - 5}` : ""}. Najprije promijenite ili obrišite te zapise.`);
      return [{ path: docPath(collection, valid), content: null }];
    },
  });
}

/* ---------- Utakmice ---------- */

const optionalScore = z.number().int().nonnegative("Rezultat ne može biti negativan.").nullable().optional();

const matchForm = z.object({
  ageGroup: z.string().min(1, "Odaberite uzrast."),
  season: z.string().min(1, "Odaberite sezonu."),
  stage: z.enum(["league", "playoff", "playout"]),
  round: z.string().trim().min(1, "Upišite kolo (npr. 1. kolo)."),
  date: z.string().min(1, "Upišite datum utakmice."),
  time: z.string().min(1, "Upišite vrijeme početka."),
  venue: z.string().trim().min(1, "Upišite igralište."),
  homeTeam: z.string().min(1, "Odaberite domaćina."),
  awayTeam: z.string().min(1, "Odaberite gosta."),
  status: z.enum(["scheduled", "played", "postponed", "cancelled"]),
  homeScore: optionalScore,
  awayScore: optionalScore,
  scorers: z.array(z.object({
    player: z.string().nullish(),
    playerName: z.string().trim().nullish(),
    team: z.string().nullish(),
    goals: z.number().int().positive("Broj golova mora biti barem 1.").nullish(),
  })).default([]),
  published: z.boolean(),
});

export async function saveMatch(id: string | null, _previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  let newId = "";
  const result = await saveContent({
    message: id ? "uređena utakmica" : "nova utakmica",
    build: async (snapshot) => {
      const form = checked(readRawPayload(formData), matchForm);
      const current = data(snapshot);
      const matchId = existingId(id, current.matches.map((match) => match.id), "Utakmica");
      const teams = new Map(current.teams.map((team) => [team.id, team]));
      const players = new Map(current.players.map((player) => [player.id, player]));
      const home = teams.get(form.homeTeam);
      const away = teams.get(form.awayTeam);
      if (!home || !away) throw new UserError("Odabrani klub više ne postoji.");
      if (home.id === away.id) throw new UserError("Domaćin i gost ne mogu biti isti klub.");

      const hasScore = form.homeScore != null && form.awayScore != null;
      const status = hasScore && form.status === "scheduled" ? "played" : form.status;
      if (status === "played" && !hasScore) throw new UserError("Utakmica je označena kao odigrana — upišite golove domaćina i gosta.");

      const scorers = form.scorers.map((scorer, index) => {
        const player = scorer.player ? players.get(scorer.player) : undefined;
        if (scorer.player && !player) throw new UserError(`Strijelac ${index + 1}: odabrani igrač više ne postoji.`);
        const name = scorer.playerName?.trim();
        if (!player && !name) throw new UserError(`Strijelac ${index + 1}: odaberite igrača ili upišite ime.`);
        const teamId = scorer.team || player?.teamId;
        if (!teamId) throw new UserError(`Strijelac ${index + 1}: odaberite klub strijelca.`);
        return {
          ...(player ? { player: referenceTo("player", player.id) } : { playerName: name }),
          team: referenceTo("team", teamId),
          goals: scorer.goals ?? 1,
        };
      });

      const kickoff = zagrebIso(form.date, form.time);
      const document = checked({
        title: `${form.round} — ${home.name} – ${away.name}`,
        season: referenceTo("season", form.season),
        ageGroup: referenceTo("ageGroup", form.ageGroup),
        stage: form.stage,
        round: form.round,
        kickoff,
        venue: form.venue,
        homeTeam: referenceTo("team", home.id),
        awayTeam: referenceTo("team", away.id),
        status,
        ...(hasScore ? { homeScore: form.homeScore, awayScore: form.awayScore } : {}),
        scorers,
        visibility: form.published ? "public" : "draft",
      }, matchSchema);

      const finalId = matchId ?? uniqueId(`${form.date}-${home.shortName || home.name}-${away.shortName || away.name}`, current.matches.map((match) => match.id));
      newId = finalId;
      return [jsonChange(docPath("match", finalId), document)];
    },
  });
  return result.ok && !id ? { ...result, redirectTo: savedAt("/admin/utakmice", newId) } : result;
}

export async function deleteMatch(id: string): Promise<ActionResult> {
  return deleteDocument("match", id, "utakmica", "/admin/utakmice", () => []);
}

/* ---------- Klubovi ---------- */

const teamForm = z.object({
  name: z.string().trim().min(1, "Upišite naziv kluba."),
  shortName: z.string().trim().nullish(),
  crest: z.union([formImageSchema, z.null(), z.undefined()]),
  ageGroups: z.array(z.string()).min(1, "Označite barem jedan uzrast u kojem klub igra."),
  active: z.boolean(),
});

export async function saveTeam(id: string | null, _previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  let newId = "";
  const result = await saveContent({
    message: id ? "uređen klub" : "novi klub",
    build: async (snapshot) => {
      const form = checked(readRawPayload(formData), teamForm);
      const current = data(snapshot);
      const ids = current.teams.map((team) => team.id);
      const teamId = existingId(id, ids, "Klub") ?? uniqueId(form.name, ids);
      newId = teamId;
      const changes: FileChange[] = [];
      const crest = form.crest ? await storeImage(form.crest, formData, changes) : null;
      changes.push(jsonChange(docPath("team", teamId), checked({
        name: form.name,
        ...(form.shortName ? { shortName: form.shortName } : {}),
        ...(crest ? { crest: crest.src } : {}),
        ageGroups: form.ageGroups.map((ageGroup) => ({ ageGroup: referenceTo("ageGroup", ageGroup) })),
        active: form.active,
      }, teamSchema)));
      return changes;
    },
  });
  return result.ok && !id ? { ...result, redirectTo: savedAt("/admin/klubovi", newId) } : result;
}

export async function deleteTeam(id: string): Promise<ActionResult> {
  return deleteDocument("team", id, "klub", "/admin/klubovi", (snapshot, teamId) => {
    const current = data(snapshot);
    return [
      ...current.players.filter((player) => player.teamId === teamId).map((player) => `igrač ${player.displayName}`),
      ...current.matches.filter((match) => match.homeTeam.id === teamId || match.awayTeam.id === teamId).map((match) => `utakmica ${match.title}`),
    ];
  });
}

/* ---------- Igrači ---------- */

const playerForm = z.object({
  displayName: z.string().trim().min(1, "Upišite ime igrača."),
  team: z.string().min(1, "Odaberite klub."),
  ageGroup: z.string().nullish(),
  active: z.boolean(),
});

export async function savePlayer(id: string | null, _previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  let newId = "";
  const result = await saveContent({
    message: id ? "uređen igrač" : "novi igrač",
    build: (snapshot) => {
      const form = checked(readRawPayload(formData), playerForm);
      const current = data(snapshot);
      const team = current.teams.find((item) => item.id === form.team);
      if (!team) throw new UserError("Odabrani klub više ne postoji.");
      const ageGroup = form.ageGroup || (team.ageGroups.length === 1 ? team.ageGroups[0] : "");
      if (!ageGroup) throw new UserError("Odaberite uzrast igrača.");
      const ids = current.players.map((player) => player.id);
      const playerId = existingId(id, ids, "Igrač") ?? uniqueId(`${form.displayName}-${team.shortName || team.name}`, ids);
      newId = playerId;
      return [jsonChange(docPath("player", playerId), checked({
        displayName: form.displayName,
        team: referenceTo("team", team.id),
        ageGroup: referenceTo("ageGroup", ageGroup),
        active: form.active,
      }, playerSchema))];
    },
  });
  return result.ok && !id ? { ...result, redirectTo: savedAt("/admin/igraci", newId) } : result;
}

export async function deletePlayer(id: string): Promise<ActionResult> {
  return deleteDocument("player", id, "igrač", "/admin/igraci", (snapshot, playerId) => data(snapshot).matches
    .filter((match) => match.scorers?.some((scorer) => scorer.playerId === playerId))
    .map((match) => `strijelac u utakmici ${match.title}`));
}

/* ---------- Sezone ---------- */

const points = (label: string) => z.number({ message: `Upišite broj bodova za ${label}.` }).int().nonnegative();

const seasonForm = z.object({
  name: z.string().trim().min(1, "Upišite naziv sezone."),
  startDate: z.string().min(1, "Upišite datum početka."),
  endDate: z.string().min(1, "Upišite datum završetka."),
  active: z.boolean(),
  pointsWin: points("pobjedu"),
  pointsDraw: points("neriješeno"),
  pointsLoss: points("poraz"),
});

const seasonDocument = (season: Season) => ({
  name: season.name, startDate: season.startDate, endDate: season.endDate, active: season.active,
  pointsWin: season.points.win, pointsDraw: season.points.draw, pointsLoss: season.points.loss,
});

export async function saveSeason(id: string | null, _previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  let newId = "";
  const result = await saveContent({
    message: id ? "uređena sezona" : "nova sezona",
    build: (snapshot) => {
      const form = checked(readRawPayload(formData), seasonForm);
      const current = data(snapshot);
      const ids = current.seasons.map((season) => season.id);
      const seasonId = existingId(id, ids, "Sezona") ?? uniqueId(form.name, ids);
      newId = seasonId;
      const changes = [jsonChange(docPath("season", seasonId), checked(form, seasonSchema))];
      // Only one season can be active: switching one on switches the others off.
      if (form.active) {
        for (const season of current.seasons) {
          if (season.id !== seasonId && season.active) changes.push(jsonChange(docPath("season", season.id), seasonDocument({ ...season, active: false })));
        }
      }
      return changes;
    },
  });
  return result.ok && !id ? { ...result, redirectTo: savedAt("/admin/sezone", newId) } : result;
}

export async function deleteSeason(id: string): Promise<ActionResult> {
  return deleteDocument("season", id, "sezona", "/admin/sezone", (snapshot, seasonId) => data(snapshot).matches
    .filter((match) => match.seasonId === seasonId).map((match) => `utakmica ${match.title}`));
}

/* ---------- Uzrasti ---------- */

const ageGroupForm = z.object({
  year: z.string().trim().regex(/^20\d{2}$/, "Godište mora biti četveroznamenkasti broj, npr. 2021."),
  title: z.string().trim().min(1, "Upišite naslov."),
  description: z.string().trim().min(1, "Upišite kratki opis."),
  sortOrder: z.number({ message: "Upišite redoslijed (broj)." }).int().nonnegative(),
  active: z.boolean(),
});

export async function saveAgeGroup(id: string | null, _previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  let newId = "";
  const result = await saveContent({
    message: id ? "uređen uzrast" : "novi uzrast",
    build: (snapshot) => {
      const form = checked(readRawPayload(formData), ageGroupForm);
      const current = data(snapshot);
      const ids = current.ageGroups.map((group) => group.id);
      const groupId = existingId(id, ids, "Uzrast") ?? form.year;
      if (!id && ids.includes(groupId)) throw new UserError(`Uzrast ${groupId} već postoji.`);
      newId = groupId;
      return [jsonChange(docPath("ageGroup", groupId), checked({ ...form, year: groupId }, ageGroupSchema))];
    },
  });
  return result.ok && !id ? { ...result, redirectTo: savedAt("/admin/uzrasti", newId) } : result;
}

export async function deleteAgeGroup(id: string): Promise<ActionResult> {
  return deleteDocument("ageGroup", id, "uzrast", "/admin/uzrasti", (snapshot, groupId) => {
    const current = data(snapshot);
    return [
      ...current.teams.filter((team) => team.ageGroups.includes(groupId)).map((team) => `klub ${team.name}`),
      ...current.players.filter((player) => player.ageGroup === groupId).map((player) => `igrač ${player.displayName}`),
      ...current.matches.filter((match) => match.ageGroup === groupId).map((match) => `utakmica ${match.title}`),
    ];
  });
}
