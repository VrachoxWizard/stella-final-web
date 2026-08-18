"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  { href: "/", label: "Početna" },
  { href: "/raspored", label: "Raspored" },
  { href: "/galerija", label: "Galerija" },
  { href: "/o-nama", label: "O nama" },
  { href: "/kontakt", label: "Kontakt" },
];

const ageYears = ["2015", "2016", "2017", "2019"];

export function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ageActive = pathname.startsWith("/uzrasti/");
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    document.body.classList.add("menu-open");
    return () => { window.removeEventListener("keydown", onKeyDown); document.body.classList.remove("menu-open"); };
  }, [mobileOpen]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const onScroll = () => { header.classList.toggle("header-scrolled", window.scrollY > 40); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header ref={headerRef} className="site-header">
        <div className="shell header-inner">
          <Link className="brand" href="/" aria-label="Tina Šport–Pia, početna" onClick={() => setMobileOpen(false)}>
            <Image src="/images/Tina-logo-cisti.png" width={72} height={72} alt="Grb Tina Šport–Pia" preload />
            <span><strong>Tina Šport</strong><small>Pia liga</small></span>
          </Link>
          <nav className="desktop-nav" aria-label="Glavna navigacija">
            {links.slice(0, 2).map((link) => <Link key={link.href} aria-current={isActive(link.href) ? "page" : undefined} className={isActive(link.href) ? "active" : ""} href={link.href}>{link.label}</Link>)}
            <details className={`desktop-age-menu ${ageActive ? "active" : ""}`}>
              <summary>Uzrasti <ChevronDown size={15} aria-hidden="true" /></summary>
              <div className="age-submenu">
                {ageYears.map((year) => <Link key={year} aria-current={pathname === `/uzrasti/${year}` ? "page" : undefined} className={pathname === `/uzrasti/${year}` ? "active" : ""} href={`/uzrasti/${year}`}>Uzrast {year}</Link>)}
              </div>
            </details>
            {links.slice(2).map((link) => <Link key={link.href} aria-current={isActive(link.href) ? "page" : undefined} className={isActive(link.href) ? "active" : ""} href={link.href}>{link.label}</Link>)}
          </nav>
          <Link className="button button-small header-cta" href="/raspored">Sljedeće utakmice</Link>
          <button className="menu-toggle" type="button" aria-expanded={mobileOpen} aria-controls="mobile-menu" aria-label={mobileOpen ? "Zatvori izbornik" : "Otvori izbornik"} onClick={() => setMobileOpen((open) => !open)}>
            {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </header>
      {mobileOpen && <div className="mobile-menu" id="mobile-menu">
        <nav className="shell" aria-label="Mobilna navigacija">
          <div className="mobile-menu-header">
            <button className="menu-toggle mobile-menu-close" type="button" aria-label="Zatvori izbornik" onClick={() => setMobileOpen(false)}>
              <X aria-hidden="true" />
            </button>
          </div>
          {links.map((link, index) => <Link key={link.href} style={{ "--i": index } as React.CSSProperties} aria-current={isActive(link.href) ? "page" : undefined} className={isActive(link.href) ? "active" : ""} href={link.href} onClick={() => setMobileOpen(false)}>{link.label}<span aria-hidden="true">↗</span></Link>)}
          <div className="mobile-age-group"><span>Uzrasti</span><div>{ageYears.map((year) => <Link key={year} aria-current={pathname === `/uzrasti/${year}` ? "page" : undefined} className={pathname === `/uzrasti/${year}` ? "active" : ""} href={`/uzrasti/${year}`} onClick={() => setMobileOpen(false)}>U{year}</Link>)}</div></div>
        </nav>
      </div>}
    </>
  );
}
