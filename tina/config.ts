import { defineConfig } from "tinacms";

const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

const nonNegativeInteger = (name: string) => ({
  type: "number",
  name,
  ui: {
    validate: (value?: number) => value === undefined || (Number.isInteger(value) && value >= 0)
      ? undefined
      : "Unesite cijeli broj 0 ili veći.",
  },
} as const);

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID ?? null,
  token: process.env.TINA_TOKEN ?? null,
  build: {
    publicFolder: "public",
    outputFolder: "admin",
  },
  media: {
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads",
    },
  },
  schema: {
    collections: [
      {
        name: "season",
        label: "Sezone",
        path: "content/competition/seasons",
        format: "json",
        defaultItem: () => ({ active: false, pointsWin: 3, pointsDraw: 1, pointsLoss: 0 }),
        fields: [
          { type: "string", name: "name", label: "Naziv sezone", description: "Primjer: Sezona 2026./2027.", required: true, isTitle: true },
          { type: "string", name: "startDate", label: "Datum početka", description: "Upišite datum u obliku GGGG-MM-DD.", required: true, ui: { validate: (value?: string) => /^20\d{2}-\d{2}-\d{2}$/.test(value ?? "") ? undefined : "Koristite oblik GGGG-MM-DD." } },
          { type: "string", name: "endDate", label: "Datum završetka", description: "Upišite datum u obliku GGGG-MM-DD.", required: true, ui: { validate: (value?: string) => /^20\d{2}-\d{2}-\d{2}$/.test(value ?? "") ? undefined : "Koristite oblik GGGG-MM-DD." } },
          { type: "boolean", name: "active", label: "Aktivna sezona", description: "Samo jedna sezona smije biti aktivna." },
          { ...nonNegativeInteger("pointsWin"), label: "Bodovi za pobjedu", description: "Zadano: 3", required: true },
          { ...nonNegativeInteger("pointsDraw"), label: "Bodovi za neriješeno", description: "Zadano: 1", required: true },
          { ...nonNegativeInteger("pointsLoss"), label: "Bodovi za poraz", description: "Zadano: 0", required: true },
        ],
      },
      {
        name: "ageGroup",
        label: "Uzrasti",
        path: "content/competition/age-groups",
        format: "json",
        ui: { allowedActions: { create: false, delete: false, createNestedFolder: false } },
        fields: [
          { type: "string", name: "year", label: "Godište", required: true, isTitle: true, ui: { validate: (value?: string) => /^20\d{2}$/.test(value ?? "") ? undefined : "Upišite četveroznamenkasto godište." } },
          { type: "string", name: "title", label: "Naslov stranice", required: true },
          { type: "string", name: "description", label: "Opis", description: "Kratki tekst prikazan na stranici uzrasta.", required: true, ui: { component: "textarea" } },
          { ...nonNegativeInteger("sortOrder"), label: "Redoslijed", description: "Manji broj prikazuje se ranije.", required: true },
          { type: "boolean", name: "active", label: "Aktivan uzrast", description: "Neaktivni uzrast nije vidljiv na javnom webu." },
        ],
      },
      {
        name: "team",
        label: "Klubovi",
        path: "content/competition/teams",
        format: "json",
        defaultItem: () => ({ active: true, ageGroups: [] }),
        fields: [
          { type: "string", name: "name", label: "Puni naziv", required: true, isTitle: true },
          { type: "string", name: "shortName", label: "Skraćeni naziv", description: "Opcionalna kratica za uske prikaze." },
          { type: "image", name: "crest", label: "Grb", description: "Opcionalno. Za stare medije koristite media.mnk-tinasport.hr." },
          {
            type: "object", name: "ageGroups", label: "Pripadajući uzrasti", list: true, required: true,
            description: "Dodajte svaki uzrast u kojem klub nastupa.",
            ui: { min: 1, itemProps: (item) => ({ label: item?.ageGroup ?? "Odaberite uzrast" }) },
            fields: [{ type: "reference", name: "ageGroup", label: "Uzrast", collections: ["ageGroup"], required: true }],
          },
          { type: "boolean", name: "active", label: "Aktivan klub" },
        ],
      },
      {
        name: "player",
        label: "Igrači",
        path: "content/competition/players",
        format: "json",
        defaultItem: () => ({ active: true }),
        fields: [
          { type: "string", name: "displayName", label: "Ime za prikaz", description: "Ime i prezime ili dogovoreni javni oblik.", required: true, isTitle: true },
          { type: "reference", name: "team", label: "Klub", collections: ["team"], required: true },
          { type: "reference", name: "ageGroup", label: "Uzrast", collections: ["ageGroup"], required: true },
          { type: "boolean", name: "active", label: "Aktivan igrač" },
        ],
      },
      {
        name: "match",
        label: "Utakmice, rezultati i strijelci",
        path: "content/competition/matches",
        format: "json",
        defaultItem: () => ({ title: "Nova utakmica", stage: "league", status: "scheduled", visibility: "draft", scorers: [] }),
        fields: [
          { type: "string", name: "title", label: "Naziv u administraciji", description: "Primjer: 1. kolo — Klub A / Klub B", required: true, isTitle: true },
          { type: "reference", name: "season", label: "Sezona", collections: ["season"], required: true },
          { type: "reference", name: "ageGroup", label: "Uzrast", collections: ["ageGroup"], required: true },
          { type: "string", name: "stage", label: "Faza", required: true, options: [{ value: "league", label: "Liga" }, { value: "playoff", label: "Playoff" }, { value: "playout", label: "Playout" }] },
          { type: "string", name: "round", label: "Kolo / opis faze", required: true },
          { type: "datetime", name: "kickoff", label: "Termin", description: "Na webu se prikazuje u vremenskoj zoni Europe/Zagreb.", required: true },
          { type: "string", name: "venue", label: "Igralište", required: true },
          { type: "reference", name: "homeTeam", label: "Domaćin", collections: ["team"], required: true },
          { type: "reference", name: "awayTeam", label: "Gost", collections: ["team"], required: true },
          { type: "string", name: "status", label: "Status", required: true, options: [{ value: "scheduled", label: "Zakazana" }, { value: "played", label: "Odigrana" }, { value: "postponed", label: "Odgođena" }, { value: "cancelled", label: "Otkazana" }] },
          { ...nonNegativeInteger("homeScore"), label: "Golovi domaćina", description: "Obavezno kada je utakmica odigrana." },
          { ...nonNegativeInteger("awayScore"), label: "Golovi gosta", description: "Obavezno kada je utakmica odigrana." },
          {
            type: "object", name: "scorers", label: "Strijelci", list: true,
            description: "Opcionalno. Strijelac mora biti iz jednog od klubova u utakmici.",
            ui: { itemProps: (item) => ({ label: `${item?.playerName ?? "Strijelac"}${item?.goals ? ` · ${item.goals}` : ""}` }) },
            fields: [
              { type: "reference", name: "player", label: "Igrač", collections: ["player"], description: "Odaberite evidentiranog igrača ili ispod upišite ime za prikaz." },
              { type: "string", name: "playerName", label: "Ime za prikaz", description: "Koristi se kada igrač još nije unesen u kolekciju Igrači." },
              { type: "reference", name: "team", label: "Klub strijelca", collections: ["team"], required: true },
              { type: "number", name: "goals", label: "Broj golova", required: true, ui: { validate: (value?: number) => Number.isInteger(value) && (value ?? 0) > 0 ? undefined : "Unesite pozitivan cijeli broj." } },
            ],
          },
          { type: "string", name: "visibility", label: "Vidljivost", description: "Nova utakmica je zadano skica i nije vidljiva na javnom webu.", required: true, options: [{ value: "draft", label: "Skica" }, { value: "public", label: "Javno" }] },
        ],
      },
    ],
  },
});
