/** Shrinks photos in the browser so uploads stay small (Vercel accepts at most ~4 MB per request). */

const MAX_SIDE = 1920;

export type PreparedImage = { file: File; width: number; height: number; preview: string };

export async function prepareImage(original: File): Promise<PreparedImage> {
  if (!/^image\/(jpeg|png|webp)$/.test(original.type)) {
    throw new Error(`„${original.name}” nije slika u formatu JPG, PNG ili WebP.`);
  }
  const bitmap = await createImageBitmap(original);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  // Small PNGs (logos, crests) keep their transparency.
  if (original.type === "image/png" && scale === 1 && original.size < 1024 * 1024) {
    bitmap.close();
    return { file: original, width, height, preview: URL.createObjectURL(original) };
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Preglednik ne može obraditi sliku.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
  if (!blob) throw new Error("Slika se nije uspjela obraditi.");
  const name = original.name.replace(/\.[a-z0-9]+$/i, "") + ".jpg";
  const file = new File([blob], name, { type: "image/jpeg" });
  return { file, width, height, preview: URL.createObjectURL(file) };
}

export function newUploadKey() {
  return `u${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
