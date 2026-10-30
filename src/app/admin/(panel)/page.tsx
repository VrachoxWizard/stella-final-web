import Link from "next/link";
import { CalendarDays, Contact, FileText, Home, Image as ImageIcon, Info, Layers, Megaphone, ShieldCheck, Shirt, Trophy, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { loadAdminContent } from "@/lib/cms/data";

const competitionTiles = [
  { href: "/admin/utakmice", icon: Trophy, title: "Utakmice i rezultati", text: "Dodajte utakmicu, upišite rezultat i strijelce." },
  { href: "/admin/klubovi", icon: Shirt, title: "Klubovi", text: "Ekipe koje igraju u ligi i njihovi uzrasti." },
  { href: "/admin/igraci", icon: Users, title: "Igrači", text: "Popis igrača za odabir strijelaca." },
  { href: "/admin/uzrasti", icon: Layers, title: "Uzrasti", text: "Godišta (npr. 2015) i njihove stranice." },
  { href: "/admin/sezone", icon: CalendarDays, title: "Sezone", text: "Trenutna sezona i bodovanje." },
];

const pageTiles = [
  { href: "/admin/obavijesti", icon: Megaphone, title: "Obavijesti (Aktualno)", text: "Najave i prijave na naslovnici." },
  { href: "/admin/galerija", icon: ImageIcon, title: "Galerija", text: "Dodajte ili uklonite fotografije." },
  { href: "/admin/naslovna", icon: Home, title: "Naslovna stranica", text: "Veliki naslov i tekstovi sekcija." },
  { href: "/admin/o-nama", icon: Info, title: "O nama", text: "Priča o ligi, citat i vrijednosti." },
  { href: "/admin/kontakt", icon: Contact, title: "Kontakt podaci", text: "E-mail, telefon, adresa, društvene mreže." },
  { href: "/admin/kontakt-stranica", icon: FileText, title: "Stranica Kontakt", text: "Tekstovi na stranici Kontakt." },
  { href: "/admin/zaglavlja", icon: FileText, title: "Ostali tekstovi", text: "Zaglavlja Raspored, Galerija, Uzrasti." },
  { href: "/admin/privatnost", icon: ShieldCheck, title: "Privatnost", text: "Tekst o zaštiti podataka." },
];

export default async function Dashboard() {
  const { mode } = await loadAdminContent();
  return <>
    <PageHeader title="Dobro došli!" text="Odaberite što želite urediti. Nakon spremanja promjene se na stranici pojavljuju za otprilike 2 minute." />
    {mode === "local" && <div className="cms-notice cms-notice--warning"><p>Lokalni način rada: promjene se spremaju samo na ovo računalo, ne na objavljenu stranicu.</p></div>}
    <h2 className="cms-tiles-title">Natjecanje</h2>
    <div className="cms-tiles">{competitionTiles.map(({ href, icon: Icon, title, text }) => <Link key={href} className="cms-tile" href={href}><Icon size={28} aria-hidden="true" /><strong>{title}</strong><span>{text}</span></Link>)}</div>
    <h2 className="cms-tiles-title">Sadržaj stranice</h2>
    <div className="cms-tiles">{pageTiles.map(({ href, icon: Icon, title, text }) => <Link key={href} className="cms-tile" href={href}><Icon size={28} aria-hidden="true" /><strong>{title}</strong><span>{text}</span></Link>)}</div>
  </>;
}
