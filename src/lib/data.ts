import type { AgeGroup, Announcement, GalleryImage, Match, Sponsor, Team } from "@/lib/types";

const team = (id: string, name: string, shortName?: string): Team => ({ id, name, shortName });

export const ageGroups: AgeGroup[] = [
  { year: "2015", title: "Uzrast 2015", description: "Rezultati, poredak i najbolji strijelci generacije 2015." },
  { year: "2016", title: "Uzrast 2016", description: "Rezultati, poredak i najbolji strijelci generacije 2016." },
  { year: "2017", title: "Uzrast 2017", description: "Ligaški dio i završnica generacije 2017." },
  { year: "2019", title: "Uzrast 2019", description: "Najmlađi natjecatelji Tina Šport–Pia lige." },
];

const t = {
  concordia1: team("concordia-1", "Concordia 1", "CON 1"),
  concordia2: team("concordia-2", "Concordia 2", "CON 2"),
  sava: team("sava", "Sava", "SAV"),
  sava1: team("sava-1", "Sava 1", "SAV 1"),
  sava2: team("sava-2", "Sava 2", "SAV 2"),
  rakete: team("rakete", "Rakete", "RAK"),
  zelengaj: team("zelengaj", "Zelengaj", "ZEL"),
  studentski: team("studentski-grad", "ŠN Studentski grad", "ŠNSG"),
  vatrogasac1: team("vatrogasac-1", "Vatrogasac 1", "VAT 1"),
  vatrogasac2: team("vatrogasac-2", "Vatrogasac 2", "VAT 2"),
  gracani: team("gracani", "Gračani", "GRA"),
  pema: team("pema", "Pema", "PEM"),
  brazilska: team("brazilska", "Brazilska nogometna škola", "BNŠ"),
  dinamoObrez: team("dinamo-obrez", "Dinamo Obrež", "DOB"),
  ciro1: team("ciro-academy-1", "Ćiro Academy 1", "ĆIR 1"),
  ciro2: team("ciro-academy-2", "Ćiro Academy 2", "ĆIR 2"),
  concordia: team("concordia", "Concordia", "CON"),
  trnovcica: team("trnovcica", "Trnovčica", "TRN"),
  dubrava: team("dubrava", "Dubrava", "DUB"),
  hask: team("nk-hask", "NK HAŠK", "HAŠK"),
  dubravaTim: team("dubrava-tim-kabel", "NK Dubrava Tim Kabel", "DTK"),
  rio: team("rio", "Rio", "RIO"),
  ivanjaReka: team("ivanja-reka", "Ivanja Reka", "IVR"),
  sesvete: team("sesvete", "Sesvete", "SES"),
  prigorje: team("prigorje", "Prigorje Žerjavinec", "PRI"),
};

const match = (value: Partial<Match> & Pick<Match, "id" | "ageGroup" | "kickoff" | "homeTeam" | "awayTeam">): Match => ({
  stage: "league",
  round: "Proljetni dio",
  venue: "SC Trnovčica, Zagreb",
  status: "scheduled",
  ...value,
});

export const matches: Match[] = [
  match({ id: "m01", ageGroup: "2016", kickoff: "2026-03-21T13:00:00+01:00", homeTeam: t.concordia1, awayTeam: t.sava1 }),
  match({ id: "m02", ageGroup: "2016", kickoff: "2026-03-21T13:35:00+01:00", homeTeam: t.concordia2, awayTeam: t.sava2 }),
  match({ id: "m03", ageGroup: "2015", kickoff: "2026-03-21T14:10:00+01:00", homeTeam: t.concordia1, awayTeam: t.sava }),
  match({ id: "m04", ageGroup: "2015", kickoff: "2026-03-21T14:45:00+01:00", homeTeam: t.rakete, awayTeam: t.sava }),
  match({ id: "m05", ageGroup: "2016", kickoff: "2026-03-21T15:20:00+01:00", homeTeam: t.concordia2, awayTeam: t.sava1 }),
  match({ id: "m06", ageGroup: "2016", kickoff: "2026-03-21T15:55:00+01:00", homeTeam: t.concordia2, awayTeam: t.sava2 }),
  match({ id: "m07", ageGroup: "2015", kickoff: "2026-03-22T12:00:00+01:00", homeTeam: t.studentski, awayTeam: t.zelengaj }),
  match({ id: "m08", ageGroup: "2015", kickoff: "2026-03-22T12:35:00+01:00", homeTeam: t.concordia1, awayTeam: t.vatrogasac1 }),
  match({ id: "m09", ageGroup: "2016", kickoff: "2026-03-22T13:10:00+01:00", homeTeam: t.concordia2, awayTeam: t.vatrogasac2 }),
  match({ id: "m10", ageGroup: "2017", stage: "playoff", kickoff: "2026-03-22T15:10:00+01:00", homeTeam: t.concordia1, awayTeam: t.gracani }),
  match({ id: "m11", ageGroup: "2017", stage: "playoff", kickoff: "2026-03-22T15:45:00+01:00", homeTeam: t.pema, awayTeam: t.concordia1 }),
  match({ id: "m12", ageGroup: "2017", stage: "playoff", kickoff: "2026-03-22T16:20:00+01:00", homeTeam: t.pema, awayTeam: t.brazilska }),

  match({ id: "r1501", ageGroup: "2015", kickoff: "2026-03-08T09:00:00+01:00", homeTeam: t.vatrogasac1, awayTeam: t.gracani, status: "played", homeScore: 7, awayScore: 3, scorers: [{ playerName: "Brcković", teamId: t.vatrogasac1.id, goals: 4 }, { playerName: "Čejvanović", teamId: t.vatrogasac1.id, goals: 1 }, { playerName: "Brkić", teamId: t.vatrogasac1.id, goals: 1 }, { playerName: "Šimleša", teamId: t.vatrogasac1.id, goals: 1 }, { playerName: "Filipović", teamId: t.gracani.id, goals: 2 }, { playerName: "Kirinec", teamId: t.gracani.id, goals: 1 }] }),
  match({ id: "r1502", ageGroup: "2015", kickoff: "2026-03-08T09:35:00+01:00", homeTeam: t.vatrogasac2, awayTeam: t.gracani, status: "played", homeScore: 9, awayScore: 1, scorers: [{ playerName: "Asani", teamId: t.vatrogasac2.id, goals: 3 }, { playerName: "Colnar", teamId: t.vatrogasac2.id, goals: 3 }, { playerName: "Plemić", teamId: t.vatrogasac2.id, goals: 1 }, { playerName: "Stavljević", teamId: t.vatrogasac2.id, goals: 1 }, { playerName: "Radujković", teamId: t.vatrogasac2.id, goals: 1 }, { playerName: "Kirinec", teamId: t.gracani.id, goals: 1 }] }),
  match({ id: "r1503", ageGroup: "2015", kickoff: "2026-03-08T10:10:00+01:00", homeTeam: t.gracani, awayTeam: t.dinamoObrez, status: "played", homeScore: 1, awayScore: 11, scorers: [{ playerName: "Spahić", teamId: t.gracani.id, goals: 1 }, { playerName: "Karadža", teamId: t.dinamoObrez.id, goals: 4 }, { playerName: "Hinger", teamId: t.dinamoObrez.id, goals: 2 }, { playerName: "Ključar", teamId: t.dinamoObrez.id, goals: 3 }, { playerName: "Špionjak", teamId: t.dinamoObrez.id, goals: 1 }, { playerName: "Novoselec", teamId: t.dinamoObrez.id, goals: 1 }] }),

  match({ id: "r1601", ageGroup: "2016", kickoff: "2026-03-08T11:00:00+01:00", homeTeam: t.ciro1, awayTeam: t.dinamoObrez, status: "played", homeScore: 10, awayScore: 0, scorers: [{ playerName: "Bešlić", teamId: t.ciro1.id, goals: 6 }, { playerName: "Rukavina", teamId: t.ciro1.id, goals: 1 }, { playerName: "Glamuzina", teamId: t.ciro1.id, goals: 1 }, { playerName: "Marić", teamId: t.ciro1.id, goals: 1 }] }),
  match({ id: "r1602", ageGroup: "2016", kickoff: "2026-03-08T11:35:00+01:00", homeTeam: t.ciro2, awayTeam: t.dinamoObrez, status: "played", homeScore: 3, awayScore: 1, scorers: [{ playerName: "Šušnja", teamId: t.ciro2.id, goals: 1 }, { playerName: "Zeba", teamId: t.ciro2.id, goals: 1 }, { playerName: "Brajica", teamId: t.ciro2.id, goals: 1 }, { playerName: "Hinger", teamId: t.dinamoObrez.id, goals: 1 }] }),
  match({ id: "r1603", ageGroup: "2016", kickoff: "2026-03-08T12:10:00+01:00", homeTeam: t.ciro1, awayTeam: t.concordia, status: "played", homeScore: 15, awayScore: 0, scorers: [{ playerName: "Rukavina", teamId: t.ciro1.id, goals: 6 }, { playerName: "Marić", teamId: t.ciro1.id, goals: 4 }, { playerName: "Bešlić", teamId: t.ciro1.id, goals: 3 }, { playerName: "Glamuzina", teamId: t.ciro1.id, goals: 1 }, { playerName: "Lisak", teamId: t.ciro1.id, goals: 1 }] }),
  match({ id: "r1604", ageGroup: "2016", kickoff: "2026-03-08T12:45:00+01:00", homeTeam: t.ciro2, awayTeam: t.concordia, status: "played", homeScore: 6, awayScore: 0, scorers: [{ playerName: "Bunjak", teamId: t.ciro2.id, goals: 3 }, { playerName: "Brajko", teamId: t.ciro2.id, goals: 2 }, { playerName: "Mustač", teamId: t.ciro2.id, goals: 1 }] }),
  match({ id: "r1605", ageGroup: "2016", kickoff: "2026-03-08T13:20:00+01:00", homeTeam: t.ciro2, awayTeam: t.zelengaj, status: "played", homeScore: 7, awayScore: 2, scorers: [{ playerName: "Tadić", teamId: t.ciro2.id, goals: 2 }, { playerName: "Šušnja", teamId: t.ciro2.id, goals: 2 }, { playerName: "Duvnjak", teamId: t.ciro2.id, goals: 1 }, { playerName: "Brajko", teamId: t.ciro2.id, goals: 1 }, { playerName: "Mustač", teamId: t.ciro2.id, goals: 1 }, { playerName: "Medić", teamId: t.zelengaj.id, goals: 2 }] }),
  match({ id: "r1606", ageGroup: "2016", kickoff: "2026-03-08T13:55:00+01:00", homeTeam: t.dinamoObrez, awayTeam: t.zelengaj, status: "played", homeScore: 6, awayScore: 2, scorers: [{ playerName: "Hinger", teamId: t.dinamoObrez.id, goals: 3 }, { playerName: "Vračarić", teamId: t.dinamoObrez.id, goals: 1 }, { playerName: "Petrušić", teamId: t.dinamoObrez.id, goals: 1 }, { playerName: "Špijonjak", teamId: t.dinamoObrez.id, goals: 1 }, { playerName: "Medić", teamId: t.zelengaj.id, goals: 2 }] }),

  match({ id: "r1701", ageGroup: "2017", kickoff: "2026-03-08T14:30:00+01:00", homeTeam: t.dinamoObrez, awayTeam: t.gracani, status: "played", homeScore: 2, awayScore: 2, scorers: [{ playerName: "Tomić", teamId: t.dinamoObrez.id, goals: 1 }, { playerName: "Skrba", teamId: t.dinamoObrez.id, goals: 1 }, { playerName: "Spahić", teamId: t.gracani.id, goals: 1 }, { playerName: "Juratovac", teamId: t.gracani.id, goals: 1 }] }),
  match({ id: "r1702", ageGroup: "2017", kickoff: "2026-03-08T15:05:00+01:00", homeTeam: t.dinamoObrez, awayTeam: t.trnovcica, status: "played", homeScore: 0, awayScore: 4, scorers: [{ playerName: "Lončar", teamId: t.trnovcica.id, goals: 4 }] }),
  match({ id: "r1703", ageGroup: "2017", kickoff: "2026-03-08T15:40:00+01:00", homeTeam: t.gracani, awayTeam: t.trnovcica, status: "played", homeScore: 2, awayScore: 6, scorers: [{ playerName: "Spahić", teamId: t.gracani.id, goals: 2 }, { playerName: "Malenica", teamId: t.trnovcica.id, goals: 2 }, { playerName: "Lončar", teamId: t.trnovcica.id, goals: 2 }, { playerName: "Jakić", teamId: t.trnovcica.id, goals: 1 }, { playerName: "Banek", teamId: t.trnovcica.id, goals: 1 }] }),
  match({ id: "r1704", ageGroup: "2017", kickoff: "2026-03-08T16:15:00+01:00", homeTeam: t.dubrava, awayTeam: t.trnovcica, status: "played", homeScore: 4, awayScore: 4, scorers: [{ playerName: "Mužić", teamId: t.dubrava.id, goals: 1 }, { playerName: "Ivandić", teamId: t.dubrava.id, goals: 1 }, { playerName: "Bekavac", teamId: t.dubrava.id, goals: 1 }, { playerName: "Večerić", teamId: t.dubrava.id, goals: 1 }, { playerName: "Lončar", teamId: t.trnovcica.id, goals: 2 }, { playerName: "Titlić", teamId: t.trnovcica.id, goals: 1 }, { playerName: "Banek", teamId: t.trnovcica.id, goals: 1 }] }),

  match({ id: "r1901", ageGroup: "2019", kickoff: "2026-03-08T08:00:00+01:00", homeTeam: t.ciro1, awayTeam: t.dinamoObrez, status: "played", homeScore: 5, awayScore: 0, scorers: [{ playerName: "Jurić", teamId: t.ciro1.id, goals: 2 }, { playerName: "Mišić", teamId: t.ciro1.id, goals: 1 }, { playerName: "Bihlen", teamId: t.ciro1.id, goals: 1 }, { playerName: "Karić", teamId: t.ciro1.id, goals: 1 }] }),
  match({ id: "r1902", ageGroup: "2019", kickoff: "2026-03-08T08:35:00+01:00", homeTeam: t.ciro2, awayTeam: t.dinamoObrez, status: "played", homeScore: 1, awayScore: 7, scorers: [{ playerName: "Karić", teamId: t.ciro2.id, goals: 1 }, { playerName: "Belošević", teamId: t.dinamoObrez.id, goals: 2 }, { playerName: "Hinger", teamId: t.dinamoObrez.id, goals: 1 }, { playerName: "Petravić", teamId: t.dinamoObrez.id, goals: 1 }, { playerName: "Meštrović", teamId: t.dinamoObrez.id, goals: 2 }, { playerName: "Pršir", teamId: t.dinamoObrez.id, goals: 1 }] }),
  match({ id: "r1903", ageGroup: "2019", kickoff: "2026-03-08T09:10:00+01:00", homeTeam: t.ciro2, awayTeam: t.ciro1, status: "played", homeScore: 0, awayScore: 3, scorers: [{ playerName: "Jurić", teamId: t.ciro1.id, goals: 1 }, { playerName: "Šosić", teamId: t.ciro1.id, goals: 1 }, { playerName: "Nužda", teamId: t.ciro1.id, goals: 1 }] }),
  match({ id: "r1904", ageGroup: "2019", kickoff: "2026-03-08T09:45:00+01:00", homeTeam: t.ciro2, awayTeam: t.dubrava, status: "played", homeScore: 3, awayScore: 0 }),
  match({ id: "p1901", ageGroup: "2019", stage: "playoff", kickoff: "2026-03-15T10:00:00+01:00", homeTeam: t.hask, awayTeam: t.rio, status: "played", homeScore: 4, awayScore: 1, scorers: [{ playerName: "Vukupić", teamId: t.hask.id, goals: 1 }, { playerName: "Rončević", teamId: t.hask.id, goals: 1 }, { playerName: "Kreštalica", teamId: t.hask.id, goals: 1 }, { playerName: "Tomić", teamId: t.hask.id, goals: 1 }, { playerName: "Lasović", teamId: t.rio.id, goals: 1 }] }),
  match({ id: "p1902", ageGroup: "2019", stage: "playoff", kickoff: "2026-03-15T10:35:00+01:00", homeTeam: t.dubravaTim, awayTeam: t.ivanjaReka, status: "played", homeScore: 3, awayScore: 0 }),
  match({ id: "p1903", ageGroup: "2019", stage: "playoff", round: "Finale", kickoff: "2026-03-15T11:20:00+01:00", homeTeam: t.hask, awayTeam: t.dubravaTim, status: "played", homeScore: 4, awayScore: 1 }),
  match({ id: "p1904", ageGroup: "2019", stage: "playoff", round: "Za 3. mjesto", kickoff: "2026-03-15T11:55:00+01:00", homeTeam: t.rio, awayTeam: t.ivanjaReka, status: "played", homeScore: 3, awayScore: 0 }),
  match({ id: "m1903", ageGroup: "2019", kickoff: "2026-03-22T09:00:00+01:00", homeTeam: t.sesvete, awayTeam: t.prigorje }),
];

export const announcements: Announcement[] = [
  {
    id: "rastane-2026",
    type: "tournament",
    title: "Raštane kup 2026",
    excerpt: "Nogometni vikend, snažne utakmice i iskustvo koje mladi igrači pamte. Pratite objave i informacije organizatora.",
    image: "/images/WhatsApp-Image-2026-03-12-at-09.34.13.jpeg",
    date: "2026-02-09",
    cta: { label: "Pogledaj galeriju", href: "/galerija" },
  },
  {
    id: "trnovcica-proljece",
    type: "notice",
    title: "Proljetna liga u DSR Trnovčica",
    excerpt: "Nova kola Tina Šport–Pia lige igraju se u Sportskom centru Trnovčica. Raspored pratite na jednom mjestu.",
    image: "/images/WhatsApp-Image-2026-02-09-at-20.58.08.jpeg",
    date: "2026-03-12",
    cta: { label: "Otvori raspored", href: "/raspored" },
  },
];

export const gallery: GalleryImage[] = [
  { id: "g1", src: "/images/WhatsApp-Image-2026-02-09-at-20.58.08.jpeg", alt: "Večernja utakmica mladih nogometaša na osvijetljenom terenu DSR Trnovčica", width: 1079, height: 894 },
  { id: "g2", src: "/images/Naslovna-fotka-2.jpg", alt: "Nogometna lopta u mreži uz grb Tina Šport lige", width: 1920, height: 1281 },
  { id: "g3", src: "/images/pexels-pixabay-262524.jpg", alt: "Nogometna momčad okupljena prije utakmice", width: 1920, height: 1280 },
  { id: "g4", src: "/images/pexels-sergio-souza-9735734.jpg", alt: "Pogled iz zraka na nogometni stadion", width: 1920, height: 1080 },
  { id: "g5", src: "/images/WhatsApp-Image-2026-03-12-at-09.34.13.jpeg", alt: "Službena najava nogometnog turnira Raštane kup 2026", width: 1024, height: 1536 },
  { id: "g6", src: "/images/WhatsApp-Image-2026-03-12-at-09.34.13-1.jpeg", alt: "Pogled na bazene i smještaj sudionika Raštane kupa", width: 1000, height: 667 },
  { id: "g7", src: "/images/WhatsApp-Image-2026-03-12-at-09.34.13-2.jpeg", alt: "Večernji pogled na bazen i hotelski kompleks u Raštanima", width: 1000, height: 667 },
  { id: "g8", src: "/images/WhatsApp-Image-2026-03-12-at-09.34.14.jpeg", alt: "Hotelska soba s plavim muralom za sudionike sportskog putovanja", width: 1600, height: 1066 },
  { id: "g9", src: "/images/WhatsApp-Image-2026-03-12-at-09.34.14-1.jpeg", alt: "Smještaj pripremljen za mlade sudionike turnira", width: 1599, height: 1066 },
  { id: "g10", src: "/images/WhatsApp-Image-2026-03-12-at-09.34.14-2.jpeg", alt: "Zajedničko kupanje i odmor tijekom turnirskog putovanja", width: 2048, height: 1152 },
  { id: "g11", src: "/images/WhatsApp-Image-2026-03-12-at-09.34.14-3.jpeg", alt: "Zajednički prostor hotela za sudionike Raštane kupa", width: 1600, height: 1066 },
];

export const rastaneGallery = gallery.filter((image) => ["g6", "g7", "g8", "g9", "g10", "g11"].includes(image.id));

export const sponsorFallback: Sponsor = {
  name: "Poliklinika Ribnjak",
  image: "/images/DOC-20240309-WA0010_240729_164917_page-00012-scaled.jpg",
  width: 2560,
  height: 853,
  alt: "Poliklinika Ribnjak, službeni sponzor Tina Šport–Pia lige",
  description: "Poliklinika Ribnjak podržava natjecanje i razvoj mladih sportaša — na terenu i izvan njega.",
};

export const site = {
  name: "Tina Šport–Pia",
  description: "Malonogometna liga za djecu i mlade u Zagrebu — raspored, rezultati, tablice i galerija.",
  email: "mnl.tinasport@gmail.com",
  phone: "092 2859 555",
  phoneHref: "+385922859555",
  address: "Remetinečka cesta 7/II, 10000 Zagreb",
  organizer: "Nikola Zorotić",
  facebook: "https://www.facebook.com/Mnltinasport",
  instagram: "https://www.instagram.com/mnl.tinasport_pia/",
};
