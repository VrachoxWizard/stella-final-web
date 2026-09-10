import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getAgeGroups } from "@/lib/content";
import { site } from "@/lib/data";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const vercelUrl = process.env.VERCEL_URL?.trim();
const siteUrl = configuredSiteUrl
  ? configuredSiteUrl
  : vercelUrl
    ? `https://${vercelUrl}`
    : "https://mnk-tinasport.hr";
const isPreviewDeployment = process.env.VERCEL_ENV === "preview";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${site.name} | Liga koja odgaja igrače`, template: `%s | ${site.name}` },
  description: site.description,
  robots: { index: !isPreviewDeployment, follow: !isPreviewDeployment },
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "hr_HR",
    siteName: site.name,
    title: `${site.name} | Liga koja odgaja igrače`,
    description: site.description,
  },
  twitter: { card: "summary", title: site.name, description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#07162f",
  colorScheme: "light",
  // Ensures correct layout scaling on mobile browsers.
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const ageGroups = await getAgeGroups();
  return (
    <html lang="hr">
      <head>
        <link rel="preload" href="/fonts/barlow-condensed-latin-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/barlow-condensed-latin-ext-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Preskoči na sadržaj</a>
        <SiteHeader ageYears={ageGroups.map(({ year }) => year)} />
        <main id="main-content">{children}</main>
        <SiteFooter ageGroups={ageGroups} />
      </body>
    </html>
  );
}
