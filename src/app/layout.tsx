import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { SiteChrome } from "@/components/site-chrome";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getAgeGroups, getSettings } from "@/lib/content";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const vercelUrl = process.env.VERCEL_URL?.trim();
const siteUrl = configuredSiteUrl
  ? configuredSiteUrl
  : vercelUrl
    ? `https://${vercelUrl}`
    : "https://mnk-tinasport.hr";
const isPreviewDeployment = process.env.VERCEL_ENV === "preview";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSettings();
  const title = site.tagline ? `${site.name} | ${site.tagline}` : site.name;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s | ${site.name}` },
    description: site.description,
    robots: { index: !isPreviewDeployment, follow: !isPreviewDeployment },
    applicationName: site.name,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "hr_HR",
      siteName: site.name,
      title,
      description: site.description,
    },
    twitter: { card: "summary", title: site.name, description: site.description },
  };
}

export const viewport: Viewport = {
  themeColor: "#07162f",
  colorScheme: "light",
  // Ensures correct layout scaling on mobile browsers.
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [ageGroups, site] = await Promise.all([getAgeGroups(), getSettings()]);
  return (
    <html lang="hr">
      <head>
        <link rel="preload" href="/fonts/barlow-condensed-latin-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/barlow-condensed-latin-ext-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <SiteChrome header={<SiteHeader ageYears={ageGroups.map(({ year }) => year)} />} footer={<SiteFooter ageGroups={ageGroups} site={site} />}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
