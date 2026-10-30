import path from "node:path";

const croatian: Record<string, string> = { č: "c", ć: "c", đ: "d", š: "s", ž: "z" };

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[čćđšž]/g, (char) => croatian[char])
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "stavka";
}

export function uniqueId(base: string, taken: Iterable<string>) {
  const used = new Set(taken);
  const slug = slugify(base);
  if (!used.has(slug)) return slug;
  for (let index = 2; ; index += 1) {
    if (!used.has(`${slug}-${index}`)) return `${slug}-${index}`;
  }
}

/** Converts a Zagreb wall-clock date and time to an ISO string with the correct +01:00/+02:00 offset. */
export function zagrebIso(date: string, time: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) throw new Error("Upišite datum i vrijeme utakmice.");
  const asUtc = new Date(`${date}T${time}:00Z`);
  const name = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Zagreb", timeZoneName: "longOffset" })
    .formatToParts(new Date(asUtc.getTime() - 60 * 60 * 1000))
    .find((part) => part.type === "timeZoneName")?.value ?? "GMT+01:00";
  const offset = name.replace("GMT", "") || "+00:00";
  return `${date}T${time}:00${offset}`;
}

/** Splits an ISO kickoff into the Zagreb date and time shown in the form. */
export function zagrebParts(iso: string) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Zagreb", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .formatToParts(new Date(iso));
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return { date: `${get("year")}-${get("month")}-${get("day")}`, time: `${get("hour")}:${get("minute")}` };
}

export function formatZagreb(iso: string) {
  return new Intl.DateTimeFormat("hr-HR", { timeZone: "Europe/Zagreb", weekday: "short", day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

/** The CMS may only touch content and uploaded images, never code. */
const writablePrefixes = ["content/", "public/uploads/"];

export function assertWritablePath(file: string) {
  const normalized = path.posix.normalize(file);
  if (normalized !== file || file.includes("..") || !writablePrefixes.some((prefix) => file.startsWith(prefix))) {
    throw new Error(`CMS ne smije mijenjati datoteku ${file}.`);
  }
}
