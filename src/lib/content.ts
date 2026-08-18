import { draftMode } from "next/headers";
import { announcements as localAnnouncements, gallery as localGallery, matches as localMatches, sponsorFallback } from "@/lib/data";
import type { Announcement, GalleryImage, Match, Sponsor } from "@/lib/types";
import { previewClient, sanityClient } from "@/sanity/client";
import { sanityConfigured } from "@/sanity/env";
import { announcementsQuery, galleryQuery, matchesQuery, sponsorQuery } from "@/sanity/queries";

async function fetchContent<T>(query: string, fallback: T, tag: string): Promise<T> {
  if (!sanityConfigured) return fallback;
  const { isEnabled } = await draftMode();
  const client = isEnabled ? previewClient : sanityClient;
  try {
    const result = await client.fetch<T>(query, {}, isEnabled ? {} : { next: { revalidate: 3600, tags: [tag] } });
    return Array.isArray(result) && result.length === 0 ? fallback : result;
  } catch {
    return fallback;
  }
}

export const getMatches = () => fetchContent<Match[]>(matchesQuery, localMatches, "matches");
export const getAnnouncements = () => fetchContent<Announcement[]>(announcementsQuery, localAnnouncements, "announcements");
export const getGallery = () => fetchContent<GalleryImage[]>(galleryQuery, localGallery, "gallery");

export async function getSponsor(): Promise<Sponsor> {
  if (!sanityConfigured) return sponsorFallback;
  const { isEnabled } = await draftMode();
  const client = isEnabled ? previewClient : sanityClient;
  try {
    const sponsor = await client.fetch<Partial<Sponsor> | null>(sponsorQuery, {}, isEnabled ? {} : { next: { revalidate: 3600, tags: ["site-settings"] } });
    if (!sponsor?.image) return sponsorFallback;
    return {
      name: sponsor.name || sponsorFallback.name,
      image: sponsor.image,
      width: sponsor.width || sponsorFallback.width,
      height: sponsor.height || sponsorFallback.height,
      alt: `${sponsor.name || sponsorFallback.name}, službeni sponzor Tina Šport–Pia lige`,
      description: sponsor.description || sponsorFallback.description,
      ...(sponsor.url ? { url: sponsor.url } : {}),
    };
  } catch {
    return sponsorFallback;
  }
}
