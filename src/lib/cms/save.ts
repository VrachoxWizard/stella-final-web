import "server-only";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { parseCompetitionFiles } from "@/lib/competition-content";
import { toJson, type ContentFiles } from "@/lib/content-files";
import { requireAdmin } from "@/lib/cms/auth";
import { ConflictError, getStore, type FileChange, type Snapshot } from "@/lib/cms/store";
import { slugify } from "@/lib/cms/utils";
import { parseSiteFiles } from "@/lib/site-content";

z.config(z.locales.hr());

export type ActionResult = { ok: boolean; message: string; redirectTo?: string };

/** An error whose message is shown to the editor as-is. */
export class UserError extends Error {}

export function jsonChange(file: string, value: unknown): FileChange {
  return { path: file, content: toJson(value) };
}

function applyChanges(files: ContentFiles, changes: FileChange[]) {
  const next = { ...files };
  for (const change of changes) {
    if (!change.path.startsWith("content/")) continue;
    if (change.content === null) delete next[change.path];
    else next[change.path] = typeof change.content === "string" ? change.content : Buffer.from(change.content).toString("utf8");
  }
  return next;
}

/** The same checks the Vercel build runs, so a save can never break the public site. */
export function validateAll(files: ContentFiles) {
  parseSiteFiles(files);
  parseCompetitionFiles(files);
}

function friendly(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/^Neispravni CMS podaci:\n/, "").replace(/\n\s+→ at .*/g, "").replace(/✖ /g, "");
}

export function zodMessage(error: z.ZodError) {
  return error.issues.map((issue) => issue.message).filter((value, index, all) => all.indexOf(value) === index).join(" ");
}

export async function saveContent({ message, build, redirectTo }: {
  message: string;
  build: (snapshot: Snapshot) => FileChange[] | Promise<FileChange[]>;
  redirectTo?: string;
}): Promise<ActionResult> {
  await requireAdmin();
  try {
    const store = getStore();
    for (let attempt = 0; ; attempt += 1) {
      const snapshot = await store.load();
      // Unchanged documents are skipped so a save without edits does not trigger a redeploy.
      const changes = (await build(snapshot)).filter((change) => typeof change.content !== "string" || snapshot.files[change.path] !== change.content);
      if (!changes.length) return { ok: true, message: "Nema promjena — sve je već spremljeno." };
      try {
        validateAll(applyChanges(snapshot.files, changes));
      } catch (error) {
        return { ok: false, message: `Nije spremljeno. ${friendly(error)}` };
      }
      try {
        await store.commit(changes, `CMS: ${message}`, snapshot.head);
      } catch (error) {
        if (error instanceof ConflictError && attempt < 2) continue;
        throw error;
      }
      revalidatePath("/", "layout");
      return {
        ok: true,
        message: store.mode === "github" ? "Spremljeno! Promjene će biti vidljive na stranici za otprilike 2 minute." : "Spremljeno!",
        redirectTo,
      };
    }
  } catch (error) {
    if (error instanceof UserError) return { ok: false, message: error.message };
    console.error("CMS save failed", error);
    return { ok: false, message: error instanceof Error ? error.message : "Spremanje nije uspjelo. Pokušajte ponovno." };
  }
}

export function readRawPayload(formData: FormData): unknown {
  try {
    return JSON.parse(String(formData.get("payload") ?? "null"));
  } catch {
    throw new UserError("Podaci obrasca nisu ispravni. Osvježite stranicu i pokušajte ponovno.");
  }
}

export function checked<T>(value: unknown, schema: z.ZodType<T>): T {
  const parsed = schema.safeParse(value);
  if (!parsed.success) throw new UserError(`Nije spremljeno. ${zodMessage(parsed.error)}`);
  return parsed.data;
}

/* ---------- Slike ---------- */

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export type ImageValue = { src: string; width: number; height: number };
export type FormImage = ImageValue | { upload: string; name: string; width: number; height: number };

export const formImageSchema = z.union([
  z.object({ src: z.string().min(1), width: z.number().int().positive(), height: z.number().int().positive() }),
  z.object({ upload: z.string().regex(/^[\w-]+$/), name: z.string().max(200), width: z.number().int().positive().max(10000), height: z.number().int().positive().max(10000) }),
]);

function imageExtension(bytes: Uint8Array) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "png";
  if (String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP") return "webp";
  return null;
}

/** Turns a newly picked image into a file in public/uploads and returns the value to store. */
export async function storeImage(value: FormImage, formData: FormData, changes: FileChange[]): Promise<ImageValue> {
  if ("src" in value) return value;
  const file = formData.get(`upload:${value.upload}`);
  if (!(file instanceof File)) throw new UserError("Slika se nije uspjela prenijeti. Odaberite je ponovno.");
  if (file.size > MAX_IMAGE_BYTES) throw new UserError("Slika je prevelika (najviše 4 MB).");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const extension = imageExtension(bytes);
  if (!extension) throw new UserError("Dopuštene su samo slike (JPG, PNG ili WebP).");
  const base = slugify(value.name.replace(/\.[a-z0-9]+$/i, "")).slice(0, 40);
  const filePath = `public/uploads/${new Date().getFullYear()}/${base}-${randomBytes(3).toString("hex")}.${extension}`;
  changes.push({ path: filePath, content: bytes });
  return { src: filePath.replace(/^public/, ""), width: value.width, height: value.height };
}
