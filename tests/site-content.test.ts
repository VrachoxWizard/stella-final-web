import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { ContentFiles } from "@/lib/content-files";
import { parseCompetitionFiles } from "@/lib/competition-content";
import { parseSiteFiles } from "@/lib/site-content";

function readRepoContent(): ContentFiles {
  const files: ContentFiles = {};
  const walk = (relative: string) => {
    for (const entry of readdirSync(path.join(process.cwd(), relative), { withFileTypes: true })) {
      const child = `${relative}/${entry.name}`;
      if (entry.isDirectory()) walk(child);
      else if (entry.name.endsWith(".json")) files[child] = readFileSync(path.join(process.cwd(), child), "utf8");
    }
  };
  walk("content");
  return files;
}

describe("repository content", () => {
  const files = readRepoContent();

  it("parses every site document", () => {
    const site = parseSiteFiles(files);
    expect(site.settings.email).toContain("@");
    expect(site.announcements.items.map(({ id }) => id)).toEqual(["prijave-liga", "kup-skradina"]);
    expect(site.gallery.images.filter(({ featured }) => featured)).toHaveLength(6);
  });

  it("keeps announcements free of removed media", () => {
    const { announcements } = parseSiteFiles(files);
    expect(announcements.items.every(({ image, buttonLink }) => image === undefined && buttonLink === "/kontakt")).toBe(true);
  });

  it("parses competition documents", () => {
    expect(parseCompetitionFiles(files).ageGroups.map(({ year }) => year)).toEqual(["2015", "2016", "2017", "2018", "2019", "2020"]);
  });

  it("reports which site document is broken", () => {
    expect(() => parseSiteFiles({ ...files, "content/site/settings.json": "{\"name\": \"\"}" })).toThrow(/content\/site\/settings\.json/);
  });
});
