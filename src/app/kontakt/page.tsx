import type { Metadata } from "next";
import { Camera, Mail, MapPin, MessageCircle, Phone, UserRound } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { getSite } from "@/lib/content";
import { phoneHref } from "@/lib/phone";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSite();
  return { title: "Kontakt", description: `Kontaktirajte organizatora ${settings.name} lige.`, alternates: { canonical: "/kontakt" } };
}

export default async function ContactPage() {
  const { contact, settings: site } = await getSite();
  const tel = `tel:${phoneHref(site.phone)}`;
  return <><PageHero eyebrow={contact.hero.eyebrow} title={contact.hero.title} copy={contact.hero.text} word={contact.hero.word} image="/images/WhatsApp-Image-2026-02-09-at-20.58.08.jpeg" /><section className="section"><div className="shell contact-layout">
    <div className="contact-details">{contact.eyebrow && <span className="eyebrow">{contact.eyebrow}</span>}<h2>{contact.heading}</h2>{contact.text && <p>{contact.text}</p>}<div className="contact-list"><span><UserRound /><span><small>Organizator</small>{site.organizer}</span></span><a href={tel}><Phone /><span><small>Telefon</small>{site.phone}</span></a><a href={`mailto:${site.email}`}><Mail /><span><small>E-mail</small>{site.email}</span></a><span><MapPin /><span><small>Adresa</small>{site.address}</span></span></div><div className="socials">{site.facebook && <a href={site.facebook} target="_blank" rel="noreferrer" aria-label={`${site.name} na Facebooku`}><MessageCircle /></a>}{site.instagram && <a href={site.instagram} target="_blank" rel="noreferrer" aria-label={`${site.name} na Instagramu`}><Camera /></a>}</div></div>
    <aside className="contact-card" aria-labelledby="contact-card-title">
      {contact.cardEyebrow && <span className="eyebrow">{contact.cardEyebrow}</span>}
      <h2 id="contact-card-title">{contact.cardHeading}</h2>
      {contact.cardText && <p>{contact.cardText}</p>}
      <div className="contact-card-actions">
        <a className="button" href={`mailto:${site.email}`}><Mail size={18} aria-hidden="true" /> Pošalji e-mail</a>
        <a className="button contact-card-phone" href={tel}><Phone size={18} aria-hidden="true" /> Nazovi nas</a>
      </div>
      {contact.cardNote && <small>{contact.cardNote}</small>}
    </aside>
  </div></section></>;
}
