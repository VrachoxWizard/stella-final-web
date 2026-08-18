import type { MetadataRoute } from "next";
import { ageGroups } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mnk-tinasport.hr";
  const routes = ["", "/raspored", "/galerija", "/o-nama", "/kontakt", "/privatnost"];
  return [...routes.map((route) => ({ url: `${base}${route}`, lastModified: new Date(), changeFrequency: route === "" ? "weekly" as const : "monthly" as const, priority: route === "" ? .9 : .7 })), ...ageGroups.map(({ year }) => ({ url: `${base}/uzrasti/${year}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: .8 }))];
}
