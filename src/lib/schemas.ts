import { z } from "zod";

const required = (label: string) => z.string().trim().min(1, `Polje „${label}” je obavezno.`);
const optionalText = z.string().trim().default("");
const reference = z.string().min(1);
const nonNegativeInteger = z.number().int().nonnegative();
const link = (label: string) => required(label).refine((value) => /^(\/|https?:\/\/|mailto:|tel:)/.test(value), `„${label}” mora počinjati s / ili https://`);
const imagePath = z.string().trim().regex(/^(\/[\w\-./%]+|https:\/\/[\w\-./%?=&]+)$/, "Neispravna putanja slike.");

/* ---------- Natjecanje (content/competition) ---------- */

export const seasonSchema = z.object({
  name: required("Naziv sezone"),
  startDate: z.iso.date("Datum početka nije ispravan."),
  endDate: z.iso.date("Datum završetka nije ispravan."),
  active: z.boolean(),
  pointsWin: nonNegativeInteger,
  pointsDraw: nonNegativeInteger,
  pointsLoss: nonNegativeInteger,
});

export const ageGroupSchema = z.object({
  year: z.string().regex(/^20\d{2}$/, "Godište mora biti četveroznamenkasti broj, npr. 2015."),
  title: required("Naslov"),
  description: required("Opis"),
  sortOrder: nonNegativeInteger,
  active: z.boolean(),
});

export const teamSchema = z.object({
  name: required("Naziv kluba"),
  shortName: z.string().trim().min(1).optional(),
  crest: z.string().min(1).optional(),
  ageGroups: z.array(z.object({ ageGroup: reference })).min(1, "Klub mora imati barem jedan uzrast."),
  active: z.boolean(),
});

export const playerSchema = z.object({
  displayName: required("Ime igrača"),
  team: reference,
  ageGroup: reference,
  active: z.boolean(),
});

export const scorerSchema = z.object({
  player: reference.optional(),
  playerName: z.string().trim().min(1).optional(),
  team: reference,
  goals: z.number().int().positive("Broj golova mora biti barem 1."),
}).refine((scorer) => Boolean(scorer.player || scorer.playerName), { message: "Odaberite igrača ili upišite ime strijelca." });

export const matchSchema = z.object({
  title: required("Naziv utakmice"),
  season: reference,
  ageGroup: reference,
  stage: z.enum(["league", "playoff", "playout"]),
  round: required("Kolo"),
  kickoff: z.iso.datetime({ offset: true, message: "Datum i vrijeme utakmice nisu ispravni." }),
  venue: required("Igralište"),
  homeTeam: reference,
  awayTeam: reference,
  status: z.enum(["scheduled", "played", "postponed", "cancelled"]),
  homeScore: nonNegativeInteger.optional(),
  awayScore: nonNegativeInteger.optional(),
  scorers: z.array(scorerSchema).optional(),
  visibility: z.enum(["draft", "public"]),
});

export type SeasonDocument = z.infer<typeof seasonSchema>;
export type AgeGroupDocument = z.infer<typeof ageGroupSchema>;
export type TeamDocument = z.infer<typeof teamSchema>;
export type PlayerDocument = z.infer<typeof playerSchema>;
export type MatchDocument = z.infer<typeof matchSchema>;

/* ---------- Sadržaj stranice (content/site) ---------- */

const heroSchema = z.object({
  eyebrow: optionalText,
  title: required("Naslov"),
  text: optionalText,
  word: optionalText,
});

const headingSchema = z.object({
  eyebrow: optionalText,
  title: required("Naslov"),
  text: optionalText,
});

const buttonSchema = z.object({
  label: required("Tekst gumba"),
  href: link("Poveznica gumba"),
});

export const settingsSchema = z.object({
  name: required("Naziv lige"),
  tagline: optionalText,
  description: required("Kratki opis"),
  email: z.email("E-mail adresa nije ispravna."),
  phone: required("Telefon"),
  address: required("Adresa"),
  organizer: required("Organizator"),
  facebook: z.union([z.literal(""), z.url("Facebook poveznica nije ispravna.")]).default(""),
  instagram: z.union([z.literal(""), z.url("Instagram poveznica nije ispravna.")]).default(""),
  footerText: optionalText,
  footerSlogan: optionalText,
});

export const homeSchema = z.object({
  hero: z.object({
    eyebrow: optionalText,
    title: required("Naslov"),
    titleHighlight: optionalText,
    text: optionalText,
    primaryButton: buttonSchema,
    secondaryButton: buttonSchema,
  }),
  featuredGallery: headingSchema.extend({ show: z.boolean() }),
  schedule: headingSchema,
  ageGroups: headingSchema,
  gallery: headingSchema,
});

export const imageSchema = z.object({
  src: imagePath,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const announcementSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  visible: z.boolean(),
  style: z.enum(["light", "dark"]),
  title: required("Naslov obavijesti"),
  text: optionalText,
  highlight: optionalText,
  contactText: optionalText,
  buttonLabel: optionalText,
  buttonLink: z.union([z.literal(""), link("Poveznica gumba")]).default(""),
  image: imageSchema.optional(),
  posterTop: optionalText,
  posterTitle: optionalText,
  posterBottom: optionalText,
  posterNumber: optionalText,
});

export const announcementsSchema = z.object({ items: z.array(announcementSchema) });

export const galleryImageSchema = imageSchema.extend({
  id: z.string().regex(/^[\w-]+$/),
  alt: required("Opis slike"),
  homepage: z.boolean(),
  featured: z.boolean(),
});

export const gallerySchema = z.object({ images: z.array(galleryImageSchema) });

export const aboutSchema = z.object({
  hero: heroSchema,
  eyebrow: optionalText,
  heading: required("Naslov"),
  image: z.object({ src: imagePath, alt: required("Opis slike") }),
  text: optionalText,
  quote: optionalText,
  textAfterQuote: optionalText,
  values: z.array(z.object({ title: required("Naslov vrijednosti"), text: optionalText })),
});

export const contactSchema = z.object({
  hero: heroSchema,
  eyebrow: optionalText,
  heading: required("Naslov"),
  text: optionalText,
  cardEyebrow: optionalText,
  cardHeading: required("Naslov kartice"),
  cardText: optionalText,
  cardNote: optionalText,
});

export const privacySchema = z.object({
  hero: heroSchema,
  updated: optionalText,
  intro: optionalText,
  sections: z.array(z.object({ title: required("Naslov odlomka"), text: optionalText })),
});

export const pagesSchema = z.object({
  schedule: heroSchema,
  gallery: heroSchema,
  ageGroup: headingSchema,
  emptySchedule: headingSchema,
});

export const siteSchemas = {
  settings: settingsSchema,
  home: homeSchema,
  announcements: announcementsSchema,
  gallery: gallerySchema,
  about: aboutSchema,
  contact: contactSchema,
  privacy: privacySchema,
  pages: pagesSchema,
} as const;

export type SiteDocumentName = keyof typeof siteSchemas;
export type SiteContent = { [K in SiteDocumentName]: z.infer<(typeof siteSchemas)[K]> };
export type Settings = SiteContent["settings"];
export type Announcement = z.infer<typeof announcementSchema>;
export type GalleryImage = z.infer<typeof galleryImageSchema>;
