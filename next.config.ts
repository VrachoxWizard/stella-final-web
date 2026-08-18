import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  skipTrailingSlashRedirect: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async redirects() {
    return [
      { source: "/raspored-utakmica", destination: "/raspored", permanent: true },
      { source: "/raspored-utakmica/", destination: "/raspored", permanent: true },
      { source: "/uzrast-2015", destination: "/uzrasti/2015", permanent: true },
      { source: "/uzrast-2015/", destination: "/uzrasti/2015", permanent: true },
      { source: "/uzrast-2016", destination: "/uzrasti/2016", permanent: true },
      { source: "/uzrast-2016/", destination: "/uzrasti/2016", permanent: true },
      { source: "/uzrast-2017", destination: "/uzrasti/2017", permanent: true },
      { source: "/uzrast-2017/", destination: "/uzrasti/2017", permanent: true },
      { source: "/uzrast-2019", destination: "/uzrasti/2019", permanent: true },
      { source: "/uzrast-2019/", destination: "/uzrasti/2019", permanent: true },
      { source: "/kontrakt", destination: "/kontakt", permanent: true },
      { source: "/kontrakt/", destination: "/kontakt", permanent: true }
    ];
  }
};

export default nextConfig;
