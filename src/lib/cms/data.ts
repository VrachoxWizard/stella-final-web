import "server-only";

import { cache } from "react";
import { parseCompetitionFiles } from "@/lib/competition-content";
import { getStore } from "@/lib/cms/store";
import { parseSiteFiles } from "@/lib/site-content";

/** Fresh content for admin pages: read from GitHub (or disk locally), never from the possibly stale deploy. */
export const loadAdminContent = cache(async () => {
  const store = getStore();
  const { files } = await store.load();
  return { mode: store.mode, site: parseSiteFiles(files), competition: parseCompetitionFiles(files) };
});

export function rawImageBase() {
  const repo = process.env.GITHUB_REPO;
  if (!process.env.GITHUB_TOKEN || !repo) return null;
  return `https://raw.githubusercontent.com/${repo}/${process.env.GITHUB_BRANCH || "main"}/public`;
}
