import type { Metadata } from "next";
import { Camera, Mail, MapPin, MessageCircle, Phone, UserRound } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { site } from "@/lib/data";

export const metadata: Metadata = { title: "Kontakt", description: "Kontaktirajte organizatora Tina Šport–Pia lige.", alternates: { canonical: "/kontakt" } };

export default function ContactPage() {
  return <><PageHero eyebrow="Imate pitanje?" title="Kontakt" copy="Za informacije o rasporedu, ekipama ili sudjelovanju javite nam se izravno." word="Bok" image="/images/WhatsApp-Image-2026-02-09-at-20.58.08.jpeg" /><section className="section"><div className="shell contact-layout">
    <div className="contact-details"><span className="eyebrow">Izravni kontakt</span><h2>Tu smo za ekipe i roditelje.</h2><p>Najbrže ćemo odgovoriti e-mailom ili telefonom.</p><div className="contact-list"><span><UserRound /><span><small>Organizator</small>{site.organizer}</span></span><a href={`tel:${site.phoneHref}`}><Phone /><span><small>Telefon</small>{site.phone}</span></a><a href={`mailto:${site.email}`}><Mail /><span><small>E-mail</small>{site.email}</span></a><span><MapPin /><span><small>Adresa</small>{site.address}</span></span></div><div className="socials"><a href={site.facebook} target="_blank" rel="noreferrer" aria-label="Tina Šport na Facebooku"><MessageCircle /></a><a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Tina Šport na Instagramu"><Camera /></a></div></div>
    <aside className="contact-card" aria-labelledby="contact-card-title">
      <span className="eyebrow">Prijave i informacije</span>
      <h2 id="contact-card-title">Javite nam se izravno.</h2>
      <p>Za prijavu ekipe, informacije o rasporedu ili druga pitanja pošaljite e-mail ili nas nazovite. Odgovorit ćemo u najkraćem mogućem roku.</p>
      <div className="contact-card-actions">
        <a className="button" href={`mailto:${site.email}`}><Mail size={18} aria-hidden="true" /> Pošalji e-mail</a>
        <a className="button contact-card-phone" href={`tel:${site.phoneHref}`}><Phone size={18} aria-hidden="true" /> Nazovi nas</a>
      </div>
      <small>Kontaktni obrazac bit će dostupan naknadno.</small>
    </aside>
  </div></section></>;
}
