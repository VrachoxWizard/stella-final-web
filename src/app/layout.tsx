import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/lib/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mnk-tinasport.hr";
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
    images: [{ url: "/images/Naslovna-fotka-2.jpg", width: 1920, height: 1080, alt: "Mladi nogometaši Tina Šport–Pia lige" }],
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description, images: ["/images/Naslovna-fotka-2.jpg"] },
};

export const viewport: Viewport = { themeColor: "#07162f", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hr">
      <head>
        <link rel="preload" href="/fonts/barlow-condensed-latin-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/barlow-condensed-latin-ext-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Preskoči na sadržaj</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
