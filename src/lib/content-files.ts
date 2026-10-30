import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

/** Map of repo-relative paths (e.g. `content/site/home.json`) to file contents. */
export type ContentFiles = Record<string, string>;

export const CONTENT_DIR = "content";

export async function readContentFiles(root = process.cwd()): Promise<ContentFiles> {
  const files: ContentFiles = {};
  async function walk(relative: string) {
    let entries;
    try {
      entries = await readdir(path.join(root, relative), { withFileTypes: true });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
      throw error;
    }
    await Promise.all(entries.map(async (entry) => {
      const child = `${relative}/${entry.name}`;
      if (entry.isDirectory()) return walk(child);
      if (entry.name.endsWith(".json")) files[child] = await readFile(path.join(root, child), "utf8");
    }));
  }
  await walk(CONTENT_DIR);
  return files;
}

export function listJson(files: ContentFiles, folder: string) {
  const prefix = `${CONTENT_DIR}/${folder}/`;
  return Object.keys(files)
    .filter((file) => file.startsWith(prefix) && file.endsWith(".json") && !file.slice(prefix.length).includes("/"))
    .sort()
    .map((file) => ({ path: file, id: file.slice(prefix.length, -".json".length), raw: files[file] }));
}

export function parseJson(raw: string, file: string): unknown {
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Dokument ${file} nije ispravan JSON.`, { cause: error });
  }
}

export function toJson(value: unknown) {
  return `${JSON.stringify(value, null, 2)}\n`;
}
