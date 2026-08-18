import { defineArrayMember, defineField, defineType } from "sanity";

const siteSettings = defineType({
  name: "siteSettings", title: "Postavke stranice", type: "document",
  fields: [
    defineField({ name: "title", title: "Naziv", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "crest", title: "Grb", type: "image", options: { hotspot: true } }),
    defineField({ name: "description", title: "Opis", type: "text", rows: 3 }),
    defineField({ name: "organizer", title: "Organizator", type: "string" }),
    defineField({ name: "phone", title: "Telefon", type: "string" }),
    defineField({ name: "email", title: "E-mail", type: "string" }),
    defineField({ name: "address", title: "Adresa", type: "string" }),
    defineField({ name: "socialLinks", title: "Društvene mreže", type: "object", fields: [defineField({ name: "facebook", type: "url" }), defineField({ name: "instagram", type: "url" })] }),
    defineField({ name: "navigation", title: "Navigacija", type: "array", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "label", type: "string" }), defineField({ name: "href", type: "string" })] })] }),
    defineField({ name: "sponsor", title: "Sponzor", type: "object", fields: [defineField({ name: "name", type: "string" }), defineField({ name: "logo", type: "image" }), defineField({ name: "url", type: "url" }), defineField({ name: "description", type: "text" })] }),
    defineField({ name: "seo", title: "SEO", type: "object", fields: [defineField({ name: "title", type: "string" }), defineField({ name: "description", type: "text" }), defineField({ name: "ogImage", type: "image" })] }),
  ],
});

const season = defineType({
  name: "season", title: "Sezona", type: "document",
  fields: [defineField({ name: "title", type: "string", validation: (rule) => rule.required() }), defineField({ name: "startDate", type: "date", validation: (rule) => rule.required() }), defineField({ name: "endDate", type: "date" }), defineField({ name: "active", type: "boolean", initialValue: true }), defineField({ name: "points", type: "object", fields: [defineField({ name: "win", type: "number", initialValue: 3 }), defineField({ name: "draw", type: "number", initialValue: 1 }), defineField({ name: "loss", type: "number", initialValue: 0 })] })],
});

const ageGroup = defineType({
  name: "ageGroup", title: "Uzrast", type: "document",
  fields: [defineField({ name: "year", type: "string", validation: (rule) => rule.required() }), defineField({ name: "title", type: "string", validation: (rule) => rule.required() }), defineField({ name: "description", type: "text" }), defineField({ name: "active", type: "boolean", initialValue: true })],
  preview: { select: { title: "title", subtitle: "year" } },
});

const team = defineType({
  name: "team", title: "Momčad", type: "document",
  fields: [defineField({ name: "name", type: "string", validation: (rule) => rule.required() }), defineField({ name: "shortName", title: "Kratica", type: "string" }), defineField({ name: "crest", title: "Grb", type: "image", options: { hotspot: true } }), defineField({ name: "ageGroups", title: "Uzrasti", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "ageGroup" }] })] })],
});

const player = defineType({
  name: "player", title: "Igrač", type: "document",
  fields: [defineField({ name: "name", type: "string", validation: (rule) => rule.required() }), defineField({ name: "team", type: "reference", to: [{ type: "team" }] }), defineField({ name: "ageGroup", type: "reference", to: [{ type: "ageGroup" }] })],
});

const match = defineType({
  name: "match", title: "Utakmica", type: "document",
  fields: [
    defineField({ name: "season", type: "reference", to: [{ type: "season" }], validation: (rule) => rule.required() }),
    defineField({ name: "ageGroup", title: "Uzrast", type: "reference", to: [{ type: "ageGroup" }], validation: (rule) => rule.required() }),
    defineField({ name: "stage", title: "Faza", type: "string", options: { list: [{ title: "Liga", value: "league" }, { title: "Playoff", value: "playoff" }, { title: "Playout", value: "playout" }], layout: "radio" }, initialValue: "league" }),
    defineField({ name: "round", title: "Kolo", type: "string" }),
    defineField({ name: "kickoff", title: "Početak", type: "datetime", validation: (rule) => rule.required() }),
    defineField({ name: "venue", title: "Lokacija", type: "string" }),
    defineField({ name: "status", title: "Status", type: "string", options: { list: [{ title: "Zakazano", value: "scheduled" }, { title: "Odigrano", value: "played" }, { title: "Odgođeno", value: "postponed" }, { title: "Otkazano", value: "cancelled" }] }, initialValue: "scheduled" }),
    defineField({ name: "homeTeam", title: "Domaćin", type: "reference", to: [{ type: "team" }], validation: (rule) => rule.required() }),
    defineField({ name: "awayTeam", title: "Gost", type: "reference", to: [{ type: "team" }], validation: (rule) => rule.required() }),
    defineField({ name: "homeScore", title: "Golovi domaćina", type: "number", validation: (rule) => rule.min(0).integer() }),
    defineField({ name: "awayScore", title: "Golovi gosta", type: "number", validation: (rule) => rule.min(0).integer() }),
    defineField({ name: "scorers", title: "Strijelci", type: "array", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "player", type: "reference", to: [{ type: "player" }], validation: (rule) => rule.required() }), defineField({ name: "team", type: "reference", to: [{ type: "team" }], validation: (rule) => rule.required() }), defineField({ name: "goals", type: "number", initialValue: 1, validation: (rule) => rule.required().min(1).integer() })], preview: { select: { title: "player.name", subtitle: "team.name", goals: "goals" }, prepare: ({ title, subtitle, goals }) => ({ title: `${title} · ${goals}`, subtitle }) } })] }),
  ],
  preview: { select: { home: "homeTeam.name", away: "awayTeam.name", date: "kickoff" }, prepare: ({ home, away, date }) => ({ title: `${home ?? "?"} – ${away ?? "?"}`, subtitle: date ? new Date(date).toLocaleString("hr-HR") : "" }) },
});

const announcement = defineType({
  name: "announcement", title: "Objava", type: "document",
  fields: [defineField({ name: "type", type: "string", options: { list: ["news", "tournament", "notice"] }, initialValue: "news" }), defineField({ name: "title", type: "string", validation: (rule) => rule.required() }), defineField({ name: "excerpt", type: "text", rows: 3 }), defineField({ name: "image", type: "image", options: { hotspot: true } }), defineField({ name: "publishedAt", type: "datetime" }), defineField({ name: "expiresAt", type: "datetime" }), defineField({ name: "priority", type: "number", initialValue: 0 }), defineField({ name: "cta", type: "object", fields: [defineField({ name: "label", type: "string" }), defineField({ name: "href", type: "string" })] })],
});

const galleryAlbum = defineType({
  name: "galleryAlbum", title: "Galerijski album", type: "document",
  fields: [defineField({ name: "title", type: "string", validation: (rule) => rule.required() }), defineField({ name: "date", type: "date" }), defineField({ name: "description", type: "text" }), defineField({ name: "cover", type: "image", options: { hotspot: true } })],
});

const galleryImage = defineType({
  name: "galleryImage", title: "Fotografija", type: "document",
  fields: [defineField({ name: "title", type: "string" }), defineField({ name: "image", type: "image", options: { hotspot: true }, validation: (rule) => rule.required() }), defineField({ name: "alt", title: "Alternativni opis", type: "string", validation: (rule) => rule.required() }), defineField({ name: "album", type: "reference", to: [{ type: "galleryAlbum" }] }), defineField({ name: "order", type: "number" })],
});

const richPage = (name: string, title: string) => defineType({
  name, title, type: "document",
  fields: [defineField({ name: "title", type: "string", validation: (rule) => rule.required() }), defineField({ name: "intro", type: "text" }), defineField({ name: "body", type: "array", of: [defineArrayMember({ type: "block" }), defineArrayMember({ type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string" })] })] })],
});

export const schemaTypes = [siteSettings, season, ageGroup, team, player, match, announcement, galleryAlbum, galleryImage, richPage("aboutPage", "O nama"), richPage("privacyPage", "Privatnost")];
