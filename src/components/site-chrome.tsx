"use client";

import { usePathname } from "next/navigation";

/** Public header and footer wrap every page except the CMS at /admin, which has its own layout. */
export function SiteChrome({ header, footer, children }: { header: React.ReactNode; footer: React.ReactNode; children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return children;
  return <>
    <a className="skip-link" href="#main-content">Preskoči na sadržaj</a>
    {header}
    <main id="main-content">{children}</main>
    {footer}
  </>;
}
