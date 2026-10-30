import { z } from "zod";
import { parseJson, type ContentFiles } from "@/lib/content-files";
import { siteSchemas, type SiteContent, type SiteDocumentName } from "@/lib/schemas";

export function sitePath(name: SiteDocumentName) {
  return `content/site/${name}.json`;
}

export function parseSiteDocument<K extends SiteDocumentName>(files: ContentFiles, name: K): SiteContent[K] {
  const file = sitePath(name);
  const raw = files[file];
  if (raw === undefined) throw new Error(`Nedostaje dokument ${file}.`);
  const parsed = siteSchemas[name].safeParse(parseJson(raw, file));
  if (!parsed.success) throw new Error(`Dokument ${file} nije ispravan:\n${z.prettifyError(parsed.error)}`);
  return parsed.data as SiteContent[K];
}

export function parseSiteFiles(files: ContentFiles): SiteContent {
  const names = Object.keys(siteSchemas) as SiteDocumentName[];
  return Object.fromEntries(names.map((name) => [name, parseSiteDocument(files, name)])) as SiteContent;
}
