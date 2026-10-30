import Image from "next/image";
import Link from "next/link";
import { Camera, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { phoneHref } from "@/lib/phone";
import type { AgeGroup, Settings } from "@/lib/types";

export function SiteFooter({ ageGroups, site }: { ageGroups: AgeGroup[]; site: Settings }) {
  return (
    <footer className="site-footer">
      <div className="footer-media footer-media--placeholder" aria-hidden="true" />
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Image src="/images/Tina-logo-cisti.png" width={88} height={88} alt="Grb Tina Šport–Pia" />
          <div><strong>{site.name}</strong>{site.footerText && <p>{site.footerText}</p>}</div>
        </div>
        <div><h2>Natjecanje</h2>{ageGroups.map((group) => <Link key={group.year} href={`/uzrasti/${group.year}`}>Uzrast {group.year}</Link>)}<Link href="/raspored">Raspored utakmica</Link></div>
        <div><h2>Informacije</h2><Link href="/o-nama">O nama</Link><Link href="/galerija">Galerija</Link><Link href="/kontakt">Kontakt</Link><Link href="/privatnost">Privatnost</Link></div>
        <div className="footer-contact"><h2>Kontakt</h2><a href={`tel:${phoneHref(site.phone)}`}><Phone size={16} />{site.phone}</a><a href={`mailto:${site.email}`}><Mail size={16} />{site.email}</a><span><MapPin size={16} />{site.address}</span><div className="socials">{site.facebook && <a href={site.facebook} target="_blank" rel="noreferrer" aria-label={`${site.name} na Facebooku`}><MessageCircle /></a>}{site.instagram && <a href={site.instagram} target="_blank" rel="noreferrer" aria-label={`${site.name} na Instagramu`}><Camera /></a>}</div></div>
      </div>
      <div className="shell footer-bottom"><span>© {new Date().getFullYear()} {site.name}</span>{site.footerSlogan && <span>{site.footerSlogan}</span>}</div>
    </footer>
  );
}
