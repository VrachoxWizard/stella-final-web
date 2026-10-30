import "server-only";

import { cache } from "react";
import { parseCompetitionFiles } from "@/lib/competition-content";
import { selectPublicMatches } from "@/lib/competition-validation";
import { readContentFiles } from "@/lib/content-files";
import { parseSiteFiles } from "@/lib/site-content";

const loadFiles = cache(() => readContentFiles());
const loadCompetitionData = cache(async () => parseCompetitionFiles(await loadFiles()));
const loadSite = cache(async () => parseSiteFiles(await loadFiles()));

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

export async function getSite() {
  return loadSite();
}

export async function getSettings() {
  return (await loadSite()).settings;
}

export async function getAnnouncements() {
  return (await loadSite()).announcements.items.filter(({ visible }) => visible);
}

export async function getGallery() {
  return (await loadSite()).gallery.images;
}
