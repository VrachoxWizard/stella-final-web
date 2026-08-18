export const matchesQuery = `*[_type == "match"] | order(kickoff asc) {
  "id": _id,
  "ageGroup": ageGroup->year,
  stage,
  round,
  kickoff,
  venue,
  status,
  "homeTeam": homeTeam->{"id": _id, name, shortName},
  "awayTeam": awayTeam->{"id": _id, name, shortName},
  homeScore,
  awayScore,
  "scorers": scorers[]{"playerId": player->_id, "playerName": player->name, "teamId": team->_id, goals}
}`;

export const announcementsQuery = `*[_type == "announcement"] | order(priority desc, publishedAt desc) {
  "id": _id, type, title, excerpt, "image": image.asset->url, "date": publishedAt,
  cta{label, href}
}`;

export const galleryQuery = `*[_type == "galleryImage"] | order(order asc) {
  "id": _id, "src": image.asset->url, "alt": coalesce(alt, title),
  "width": image.asset->metadata.dimensions.width, "height": image.asset->metadata.dimensions.height
}`;

export const sponsorQuery = `*[_type == "siteSettings"][0].sponsor {
  name,
  "image": logo.asset->url,
  "width": logo.asset->metadata.dimensions.width,
  "height": logo.asset->metadata.dimensions.height,
  url,
  description
}`;
