import type { CompetitionData } from "@/lib/types";

function requireUnique(values: string[], label: string, errors: string[]) {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  if (duplicates.length) errors.push(`${label}: duplikati ${[...new Set(duplicates)].join(", ")}.`);
}

export function validateCompetitionIntegrity(data: CompetitionData): CompetitionData {
  const errors: string[] = [];
  const seasons = new Map(data.seasons.map((season) => [season.id, season]));
  const ageGroups = new Map(data.ageGroups.map((group) => [group.id, group]));
  const teams = new Map(data.teams.map((team) => [team.id, team]));
  const players = new Map(data.players.map((player) => [player.id, player]));

  requireUnique(data.seasons.map(({ id }) => id), "Sezone", errors);
  requireUnique(data.ageGroups.map(({ id }) => id), "Uzrasti", errors);
  requireUnique(data.ageGroups.map(({ year }) => year), "Godišta", errors);
  requireUnique(data.teams.map(({ id }) => id), "Klubovi", errors);
  requireUnique(data.players.map(({ id }) => id), "Igrači", errors);
  requireUnique(data.matches.map(({ id }) => id), "Utakmice", errors);

  if (data.seasons.filter(({ active }) => active).length > 1) {
    errors.push("Samo jedna sezona može biti aktivna.");
  }

  for (const season of data.seasons) {
    if (new Date(season.startDate) > new Date(season.endDate)) {
      errors.push(`Sezona „${season.name}” završava prije početka.`);
    }
  }

  for (const team of data.teams) {
    for (const ageGroup of team.ageGroups) {
      if (!ageGroups.has(ageGroup)) errors.push(`Klub „${team.name}” koristi nepoznati uzrast „${ageGroup}”.`);
    }
  }

  for (const group of data.ageGroups) {
    if (group.id !== group.year) errors.push(`Dokument uzrasta „${group.title}” mora imati naziv datoteke ${group.year}.json.`);
  }

  for (const player of data.players) {
    const team = teams.get(player.teamId);
    if (!team) errors.push(`Igrač „${player.displayName}” koristi nepoznati klub „${player.teamId}”.`);
    if (!ageGroups.has(player.ageGroup)) errors.push(`Igrač „${player.displayName}” koristi nepoznati uzrast „${player.ageGroup}”.`);
    if (team && !team.ageGroups.includes(player.ageGroup)) {
      errors.push(`Igrač „${player.displayName}” nije u uzrastu svoga kluba.`);
    }
  }

  for (const match of data.matches) {
    const prefix = `Utakmica „${match.title}”`;
    const season = seasons.get(match.seasonId);
    const group = ageGroups.get(match.ageGroup);
    const home = teams.get(match.homeTeam.id);
    const away = teams.get(match.awayTeam.id);

    if (!season) errors.push(`${prefix} koristi nepoznatu sezonu.`);
    if (!group) errors.push(`${prefix} koristi nepoznati uzrast.`);
    if (!home) errors.push(`${prefix} koristi nepoznatog domaćina.`);
    if (!away) errors.push(`${prefix} koristi nepoznatog gosta.`);
    if (home?.id === away?.id) errors.push(`${prefix} ne može imati isti klub kao domaćina i gosta.`);
    if (home && !home.ageGroups.includes(match.ageGroup)) errors.push(`${prefix}: domaćin ne pripada odabranom uzrastu.`);
    if (away && !away.ageGroups.includes(match.ageGroup)) errors.push(`${prefix}: gost ne pripada odabranom uzrastu.`);

    if (match.status === "played" && (match.homeScore === undefined || match.awayScore === undefined)) {
      errors.push(`${prefix} je odigrana, ali nema potpun rezultat.`);
    }

    for (const scorer of match.scorers ?? []) {
      if (scorer.teamId !== home?.id && scorer.teamId !== away?.id) {
        errors.push(`${prefix}: strijelac „${scorer.playerName}” nije iz kluba koji igra utakmicu.`);
      }
      if (scorer.playerId) {
        const player = players.get(scorer.playerId);
        if (!player) errors.push(`${prefix}: strijelac „${scorer.playerName}” nije pronađen među igračima.`);
        if (player && (player.teamId !== scorer.teamId || player.ageGroup !== match.ageGroup)) {
          errors.push(`${prefix}: strijelac „${scorer.playerName}” nema odgovarajući klub ili uzrast.`);
        }
      }
    }
  }

  if (errors.length) {
    throw new Error(`Neispravni CMS podaci:\n- ${errors.join("\n- ")}`);
  }

  return data;
}

export function selectPublicMatches(data: CompetitionData) {
  const activeSeasonIds = new Set(data.seasons.filter(({ active }) => active).map(({ id }) => id));
  const activeAgeGroups = new Set(data.ageGroups.filter(({ active }) => active).map(({ id }) => id));
  const activeTeams = new Set(data.teams.filter(({ active }) => active).map(({ id }) => id));

  return data.matches
    .filter((match) => match.visibility === "public")
    .filter((match) => activeSeasonIds.has(match.seasonId))
    .filter((match) => activeAgeGroups.has(match.ageGroup))
    .filter((match) => activeTeams.has(match.homeTeam.id) && activeTeams.has(match.awayTeam.id))
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff));
}
