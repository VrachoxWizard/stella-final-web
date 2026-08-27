import "server-only";

import { loadCompetitionData } from "@/lib/competition-content";
import { selectPublicMatches } from "@/lib/competition-validation";
import { announcements, gallery, sponsorFallback } from "@/lib/data";

export async function getAgeGroups() {
  const data = await loadCompetitionData();
  return data.ageGroups.filter(({ active }) => active);
}

export async function getActiveSeason() {
  const data = await loadCompetitionData();
  return data.seasons.find(({ active }) => active);
}

export async function getMatches() {
  const data = await loadCompetitionData();
  return selectPublicMatches(data);
}

export async function getAnnouncements() {
  return announcements;
}

export async function getGallery() {
  return gallery;
}

export async function getSponsor() {
  return sponsorFallback;
}
