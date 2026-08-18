import { createReadStream, existsSync } from "node:fs";
import { join } from "node:path";
import { getCliClient } from "sanity/cli";
import { ageGroups, announcements, gallery, matches, site } from "../src/lib/data";

const client = getCliClient({ apiVersion: "2026-08-01" });
const seasonId = "season-2026";

const cleanId = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
const ref = (_ref: string) => ({ _type: "reference", _ref });

async function uploadLocalImage(publicPath: string, label: string) {
  const filePath = join(process.cwd(), "public", publicPath.replace(/^\//, ""));
  if (!existsSync(filePath)) return undefined;
  const asset = await client.assets.upload("image", createReadStream(filePath), { filename: filePath.split(/[\\/]/).pop() });
  return { _type: "image", asset: ref(asset._id), alt: label };
}

async function seed() {
  await client.createOrReplace({
    _id: "siteSettings", _type: "siteSettings", title: site.name, description: site.description,
    organizer: site.organizer, phone: site.phone, email: site.email, address: site.address,
    socialLinks: { _type: "socialLinks", facebook: site.facebook, instagram: site.instagram },
    navigation: [
      { _key: "schedule", _type: "navigationItem", label: "Raspored", href: "/raspored" },
      { _key: "ages", _type: "navigationItem", label: "Uzrasti", href: "/uzrasti/2015" },
      { _key: "gallery", _type: "navigationItem", label: "Galerija", href: "/galerija" },
      { _key: "about", _type: "navigationItem", label: "O nama", href: "/o-nama" },
      { _key: "contact", _type: "navigationItem", label: "Kontakt", href: "/kontakt" },
    ],
    sponsor: { _type: "sponsor", name: "Poliklinika Ribnjak", description: "Službeni sponzor i partner uz mlade sportaše." },
  });
  await client.createOrReplace({ _id: seasonId, _type: "season", title: "Sezona 2026", startDate: "2026-01-01", endDate: "2026-06-30", active: true, points: { _type: "points", win: 3, draw: 1, loss: 0 } });

  for (const group of ageGroups) await client.createOrReplace({ _id: `age-${group.year}`, _type: "ageGroup", ...group, active: true });

  const teams = new Map<string, (typeof matches)[number]["homeTeam"]>();
  matches.forEach((match) => { teams.set(match.homeTeam.id, match.homeTeam); teams.set(match.awayTeam.id, match.awayTeam); });
  for (const current of teams.values()) await client.createOrReplace({ _id: `team-${current.id}`, _type: "team", name: current.name, shortName: current.shortName });

  const players = new Map<string, { id: string; name: string; teamId: string; ageGroup: string }>();
  matches.forEach((match) => match.scorers?.forEach((scorer) => {
    const id = `player-${cleanId(`${scorer.playerName}-${scorer.teamId}`)}`;
    players.set(id, { id, name: scorer.playerName, teamId: scorer.teamId, ageGroup: match.ageGroup });
  }));
  for (const player of players.values()) await client.createOrReplace({ _id: player.id, _type: "player", name: player.name, team: ref(`team-${player.teamId}`), ageGroup: ref(`age-${player.ageGroup}`) });

  for (const current of matches) await client.createOrReplace({
    _id: `match-${current.id}`, _type: "match", season: ref(seasonId), ageGroup: ref(`age-${current.ageGroup}`), stage: current.stage,
    round: current.round, kickoff: current.kickoff, venue: current.venue, status: current.status,
    homeTeam: ref(`team-${current.homeTeam.id}`), awayTeam: ref(`team-${current.awayTeam.id}`), homeScore: current.homeScore, awayScore: current.awayScore,
    scorers: current.scorers?.map((scorer, index) => ({ _key: `${index}`, _type: "scorerEntry", player: ref(`player-${cleanId(`${scorer.playerName}-${scorer.teamId}`)}`), team: ref(`team-${scorer.teamId}`), goals: scorer.goals })),
  });

  for (const item of announcements) await client.createOrReplace({ _id: `announcement-${item.id}`, _type: "announcement", type: item.type, title: item.title, excerpt: item.excerpt, publishedAt: `${item.date}T10:00:00Z`, priority: 10, cta: item.cta ? { _type: "cta", ...item.cta } : undefined, image: await uploadLocalImage(item.image, item.title) });
  await client.createOrReplace({ _id: "album-2026", _type: "galleryAlbum", title: "Sezona 2026", date: "2026-03-12", description: "Utakmice i atmosfera proljetnog dijela lige." });
  for (const [index, image] of gallery.entries()) await client.createOrReplace({ _id: `gallery-${image.id}`, _type: "galleryImage", title: image.alt, alt: image.alt, order: index, album: ref("album-2026"), image: await uploadLocalImage(image.src, image.alt) });

  await client.createOrReplace({ _id: "aboutPage", _type: "aboutPage", title: "O nama", intro: "Malonogometna liga Tina Šport–Pia traje od proljeća 1992. godine." });
  await client.createOrReplace({ _id: "privacyPage", _type: "privacyPage", title: "Privatnost", intro: "Informacije o obradi podataka na web-stranici Tina Šport–Pia." });
  console.log(`Uneseno: ${matches.length} utakmica, ${teams.size} momčadi, ${players.size} igrača i ${gallery.length} fotografija.`);
}

seed().catch((error) => { console.error(error); process.exit(1); });
