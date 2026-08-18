import Image from "next/image";
import Link from "next/link";
import { Camera, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ageGroups, site } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-media" aria-hidden="true"><Image src="/images/pexels-pixabay-262524.jpg" alt="" fill sizes="100vw" /></div>
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Image src="/images/Tina-logo-cisti.png" width={88} height={88} alt="Grb Tina Šport–Pia" />
          <div><strong>Tina Šport–Pia</strong><p>Liga koja od 1992. spaja igru, prijateljstvo i prve nogometne snove.</p></div>
        </div>
        <div><h2>Natjecanje</h2>{ageGroups.map((group) => <Link key={group.year} href={`/uzrasti/${group.year}`}>Uzrast {group.year}</Link>)}<Link href="/raspored">Raspored utakmica</Link></div>
        <div><h2>Informacije</h2><Link href="/o-nama">O nama</Link><Link href="/galerija">Galerija</Link><Link href="/kontakt">Kontakt</Link><Link href="/privatnost">Privatnost</Link></div>
        <div className="footer-contact"><h2>Kontakt</h2><a href={`tel:${site.phoneHref}`}><Phone size={16} />{site.phone}</a><a href={`mailto:${site.email}`}><Mail size={16} />{site.email}</a><span><MapPin size={16} />{site.address}</span><div className="socials"><a href={site.facebook} target="_blank" rel="noreferrer" aria-label="Tina Šport–Pia na Facebooku"><MessageCircle /></a><a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Tina Šport–Pia na Instagramu"><Camera /></a></div></div>
      </div>
      <div className="shell footer-bottom"><span>© {new Date().getFullYear()} Tina Šport–Pia</span><span>Za igru. Za ekipu. Za uspomene.</span></div>
    </footer>
  );
}
