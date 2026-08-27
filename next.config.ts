import type { NextConfig } from "next";

const redirectBoth = (source: string, destination: string) => [
  { source, destination, permanent: true },
  { source: `${source}/`, destination, permanent: true },
];

const archiveSlugs = [
  "/uzrast-2009-2010",
  "/uzrast-2012",
  "/uzrast-2013",
  "/uzrast-2014",
  "/kupres-2023",
  "/ove-godine-odrzavamo-turnir-na-terenima-nk-polaca",
  "/ove-godine-odrzavamo-turnir-u-vodicama",
  "/turnir-u-turnju-2023",
  "/zavrsnica-mnl-na-klinceku-2023",
  "/turnir-sv-filip-i-jakov-turanj",
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  skipTrailingSlashRedirect: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "media.mnk-tinasport.hr" },
      { protocol: "https", hostname: "mnk-tinasport.hr", pathname: "/wp-content/uploads/**" },
    ],
  },
  async redirects() {
    return [
      ...redirectBoth("/raspored-utakmica", "/raspored"),
      ...redirectBoth("/kontrakt", "/kontakt"),
      ...redirectBoth("/uzrast-2015", "/uzrasti/2015"),
      ...redirectBoth("/uzrast-2016", "/uzrasti/2016"),
      ...redirectBoth("/uzrast-2017", "/uzrasti/2017"),
      ...redirectBoth("/uzrast-2011-2012", "/uzrasti/2018"),
      ...redirectBoth("/uzrast-2019", "/uzrasti/2019"),
      ...redirectBoth("/studio", "/admin"),
      { source: "/studio/:path*", destination: "/admin", permanent: true },
      ...archiveSlugs.flatMap((source) => redirectBoth(source, `https://arhiva.mnk-tinasport.hr${source}`)),
      { source: "/admin", destination: "/admin/index.html", permanent: false },
      { source: "/admin/", destination: "/admin/index.html", permanent: false },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/wp-content/uploads/:path*",
        destination: "https://media.mnk-tinasport.hr/wp-content/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
