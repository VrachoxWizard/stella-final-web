import type { Field, Option } from "@/components/admin/fields";
import { zagrebParts } from "@/lib/cms/utils";
import type { CompetitionData, Match } from "@/lib/types";

const ageGroupOptions = (data: CompetitionData): Option[] => data.ageGroups.map((group) => ({ value: group.id, label: `Uzrast ${group.year}${group.active ? "" : " (neaktivan)"}` }));
const teamOptions = (data: CompetitionData): Option[] => [...data.teams].sort((a, b) => a.name.localeCompare(b.name, "hr")).map((team) => ({ value: team.id, label: team.name, groups: team.ageGroups }));

export const stageLabels = { league: "Liga", playoff: "Playoff", playout: "Playout" } as const;
export const statusLabels = { scheduled: "Zakazana", played: "Odigrana", postponed: "Odgođena", cancelled: "Otkazana" } as const;

export function matchFields(data: CompetitionData): Field[] {
  const teams = teamOptions(data);
  return [
    { type: "section", label: "1. Osnovni podaci" },
    { type: "select", name: "ageGroup", label: "Uzrast", required: true, options: ageGroupOptions(data) },
    { type: "date", name: "date", label: "Datum", required: true },
    { type: "time", name: "time", label: "Vrijeme početka", required: true, help: "Po hrvatskom vremenu." },
    { type: "select", name: "homeTeam", label: "Domaćin", required: true, options: teams, filterBy: "ageGroup", help: "Prikazuju se klubovi koji igraju u odabranom uzrastu." },
    { type: "select", name: "awayTeam", label: "Gost", required: true, options: teams, filterBy: "ageGroup" },
    { type: "text", name: "venue", label: "Igralište", required: true, placeholder: "npr. ŠC Hotanj" },
    { type: "text", name: "round", label: "Kolo", required: true, placeholder: "npr. 1. kolo" },
    { type: "select", name: "stage", label: "Dio natjecanja", required: true, options: Object.entries(stageLabels).map(([value, label]) => ({ value, label })) },
    { type: "select", name: "season", label: "Sezona", required: true, options: data.seasons.map((season) => ({ value: season.id, label: `${season.name}${season.active ? " (aktivna)" : ""}` })) },
    { type: "section", anchor: "rezultat", label: "2. Rezultat", help: "Ispunite nakon utakmice. Kad upišete oba rezultata, utakmica se automatski označava kao odigrana." },
    { type: "number", name: "homeScore", label: "Golovi domaćina" },
    { type: "number", name: "awayScore", label: "Golovi gosta" },
    { type: "select", name: "status", label: "Status utakmice", required: true, options: Object.entries(statusLabels).map(([value, label]) => ({ value, label })) },
    {
      type: "list", name: "scorers", label: "Strijelci (nije obavezno)", itemLabel: "Strijelac", addLabel: "Dodaj strijelca",
      help: "Odaberite igrača s popisa. Ako ga nema na popisu, upišite ime i odaberite klub.",
      newItem: { player: "", playerName: "", team: "", goals: 1 },
      fields: [
        { type: "select", name: "player", label: "Igrač", placeholder: "— nije na popisu —", filterBy: "ageGroup", options: [...data.players].sort((a, b) => a.displayName.localeCompare(b.displayName, "hr")).map((player) => ({ value: player.id, label: `${player.displayName} (${data.teams.find((team) => team.id === player.teamId)?.name ?? "?"})`, groups: [player.ageGroup] })) },
        { type: "text", name: "playerName", label: "…ili upišite ime" },
        { type: "select", name: "team", label: "Klub strijelca", options: teams, filterBy: "ageGroup", help: "Ako ste odabrali igrača s popisa, klub se popunjava sam." },
        { type: "number", name: "goals", label: "Broj golova", min: 1 },
      ],
    },
    { type: "section", label: "3. Objava" },
    { type: "toggle", name: "published", label: "Prikaži na stranici", help: "Isključite ako utakmicu još ne želite objaviti." },
  ];
}

export function matchInitial(data: CompetitionData, match?: Match) {
  const activeSeason = data.seasons.find((season) => season.active) ?? data.seasons[0];
  if (!match) {
    return { ageGroup: "", season: activeSeason?.id ?? "", stage: "league", round: "", date: "", time: "", venue: "", homeTeam: "", awayTeam: "", status: "scheduled", homeScore: null, awayScore: null, scorers: [], published: true };
  }
  const { date, time } = zagrebParts(match.kickoff);
  return {
    ageGroup: match.ageGroup, season: match.seasonId, stage: match.stage, round: match.round, date, time, venue: match.venue,
    homeTeam: match.homeTeam.id, awayTeam: match.awayTeam.id, status: match.status,
    homeScore: match.homeScore ?? null, awayScore: match.awayScore ?? null,
    scorers: (match.scorers ?? []).map((scorer) => ({ player: scorer.playerId ?? "", playerName: scorer.playerId ? "" : scorer.playerName, team: scorer.teamId, goals: scorer.goals })),
    published: match.visibility === "public",
  };
}

export function teamFields(data: CompetitionData): Field[] {
  return [
    { type: "text", name: "name", label: "Puni naziv kluba", required: true },
    { type: "text", name: "shortName", label: "Kratki naziv (nije obavezno)", help: "Za uske prikaze, npr. na mobitelu." },
    { type: "checkboxes", name: "ageGroups", label: "Uzrasti u kojima klub igra", required: true, options: ageGroupOptions(data) },
    { type: "image", name: "crest", label: "Grb (nije obavezno)" },
    { type: "toggle", name: "active", label: "Klub je aktivan", help: "Utakmice neaktivnih klubova ne prikazuju se na stranici." },
  ];
}

export function playerFields(data: CompetitionData): Field[] {
  return [
    { type: "text", name: "displayName", label: "Ime i prezime", required: true, help: "Ili dogovoreni javni oblik imena." },
    { type: "select", name: "ageGroup", label: "Uzrast", required: true, options: ageGroupOptions(data) },
    { type: "select", name: "team", label: "Klub", required: true, options: teamOptions(data), filterBy: "ageGroup" },
    { type: "toggle", name: "active", label: "Igrač je aktivan" },
  ];
}

export const seasonFields: Field[] = [
  { type: "text", name: "name", label: "Naziv sezone", required: true, placeholder: "npr. Sezona 2026./2027." },
  { type: "date", name: "startDate", label: "Datum početka", required: true },
  { type: "date", name: "endDate", label: "Datum završetka", required: true },
  { type: "toggle", name: "active", label: "Ovo je trenutna (aktivna) sezona", help: "Na stranici se prikazuju samo utakmice aktivne sezone. Uključivanjem ove, ostale se automatski isključuju." },
  { type: "section", label: "Bodovanje" },
  { type: "number", name: "pointsWin", label: "Bodovi za pobjedu", required: true },
  { type: "number", name: "pointsDraw", label: "Bodovi za neriješeno", required: true },
  { type: "number", name: "pointsLoss", label: "Bodovi za poraz", required: true },
];

export function ageGroupFields(isNew: boolean): Field[] {
  return [
    ...(isNew ? [{ type: "text", name: "year", label: "Godište", required: true, placeholder: "npr. 2021", help: "Kasnije se ne može mijenjati. Stranica uzrasta bit će /uzrasti/godište." } as Field] : []),
    { type: "text", name: "title", label: "Naslov stranice", required: true, placeholder: "npr. Uzrast 2021" },
    { type: "textarea", name: "description", label: "Kratki opis", required: true, rows: 2 },
    { type: "number", name: "sortOrder", label: "Redoslijed u izborniku", required: true, help: "Manji broj prikazuje se prije." },
    { type: "toggle", name: "active", label: "Prikaži uzrast na stranici" },
  ];
}
