"use server";

import { z } from "zod";
import { checked, formImageSchema, jsonChange, readRawPayload, saveContent, storeImage, type ActionResult } from "@/lib/cms/save";
import type { FileChange, Snapshot } from "@/lib/cms/store";
import { siteSchemas, type SiteDocumentName } from "@/lib/schemas";
import { parseSiteDocument, sitePath } from "@/lib/site-content";

type ToDocument = (payload: unknown, formData: FormData, changes: FileChange[], snapshot: Snapshot) => unknown | Promise<unknown>;

function saveSiteDocument(name: SiteDocumentName, label: string, formData: FormData, toDocument: ToDocument = (payload) => payload) {
  return saveContent({
    message: `uređeno – ${label}`,
    build: async (snapshot) => {
      const changes: FileChange[] = [];
      const document = await toDocument(readRawPayload(formData), formData, changes, snapshot);
      changes.push(jsonChange(sitePath(name), checked(document, siteSchemas[name] as z.ZodType<unknown>)));
      return changes;
    },
  });
}

const optionalImage = z.union([formImageSchema, z.null(), z.undefined()]);

export async function saveSettings(_previous: ActionResult | null, formData: FormData) {
  return saveSiteDocument("settings", "kontakt podaci", formData);
}

export async function saveHome(_previous: ActionResult | null, formData: FormData) {
  return saveSiteDocument("home", "naslovna", formData);
}

export async function saveContactPage(_previous: ActionResult | null, formData: FormData) {
  return saveSiteDocument("contact", "stranica Kontakt", formData);
}

export async function savePrivacy(_previous: ActionResult | null, formData: FormData) {
  return saveSiteDocument("privacy", "privatnost", formData);
}

export async function savePages(_previous: ActionResult | null, formData: FormData) {
  return saveSiteDocument("pages", "ostali tekstovi", formData);
}

export async function saveAbout(_previous: ActionResult | null, formData: FormData) {
  return saveSiteDocument("about", "O nama", formData, async (payload, data, changes) => {
    const { image, ...rest } = checked(payload, z.object({ image: z.object({ photo: formImageSchema, alt: z.string() }) }).loose());
    const photo = await storeImage(image.photo, data, changes);
    return { ...rest, image: { src: photo.src, alt: image.alt } };
  });
}

export async function saveAnnouncements(_previous: ActionResult | null, formData: FormData) {
  return saveSiteDocument("announcements", "obavijesti", formData, async (payload, data, changes) => {
    const { items } = checked(payload, z.object({ items: z.array(z.object({ image: optionalImage }).loose()) }));
    return {
      items: await Promise.all(items.map(async ({ image, ...item }) => ({
        ...item,
        ...(image ? { image: await storeImage(image, data, changes) } : {}),
      }))),
    };
  });
}

export async function saveGallery(_previous: ActionResult | null, formData: FormData) {
  return saveSiteDocument("gallery", "galerija", formData, async (payload, data, changes, snapshot) => {
    const { images } = checked(payload, z.object({ images: z.array(z.object({ image: formImageSchema }).loose()) }));
    const next = await Promise.all(images.map(async ({ image, ...item }) => ({ ...item, ...(await storeImage(image, data, changes)) })));
    // Photos uploaded through the CMS are deleted from the repository once removed from the gallery.
    const kept = new Set(next.map(({ src }) => src));
    const usedElsewhere = (src: string) => Object.entries(snapshot.files).some(([file, raw]) => file !== sitePath("gallery") && raw.includes(`"${src}"`));
    for (const { src } of parseSiteDocument(snapshot.files, "gallery").images) {
      if (src.startsWith("/uploads/") && !kept.has(src) && !usedElsewhere(src)) changes.push({ path: `public${src}`, content: null });
    }
    return { images: next };
  });
}
