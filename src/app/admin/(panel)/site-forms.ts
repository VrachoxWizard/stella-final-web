import type { Field } from "@/components/admin/fields";

const hero = (name: string, label: string, help: string, withWord = true): Field => ({
  type: "group", name, label, help,
  fields: [
    { type: "text", name: "eyebrow", label: "Mali natpis iznad naslova" },
    { type: "text", name: "title", label: "Naslov", required: true },
    { type: "textarea", name: "text", label: "Tekst ispod naslova", rows: 3 },
    ...(withWord ? [{ type: "text", name: "word", label: "Velika prozirna riječ u pozadini", help: "Ukrasna riječ, npr. „Igra”. Može ostati prazno." } as Field] : []),
  ],
});

const heading = (name: string, label: string, help?: string): Field => ({
  type: "group", name, label, help,
  fields: [
    { type: "text", name: "eyebrow", label: "Mali natpis iznad naslova" },
    { type: "text", name: "title", label: "Naslov", required: true },
    { type: "textarea", name: "text", label: "Tekst", rows: 2 },
  ],
});

const paragraphsHelp = "Za novi odlomak ostavite jedan prazan red. E-mail adrese i poveznice automatski postaju klikabilne.";

export const settingsFields: Field[] = [
  { type: "section", label: "Kontakt", help: "Ovi podaci prikazuju se u podnožju svake stranice i na stranici Kontakt." },
  { type: "email", name: "email", label: "E-mail adresa", required: true },
  { type: "text", name: "phone", label: "Telefon", required: true, help: "Upišite kako želite da se prikaže, npr. 092 2859 555." },
  { type: "text", name: "address", label: "Adresa", required: true },
  { type: "text", name: "organizer", label: "Organizator lige", required: true },
  { type: "section", label: "Društvene mreže", help: "Kopirajte cijelu adresu profila. Ako ostavite prazno, ikona se neće prikazati." },
  { type: "text", name: "facebook", label: "Facebook poveznica", placeholder: "https://www.facebook.com/…" },
  { type: "text", name: "instagram", label: "Instagram poveznica", placeholder: "https://www.instagram.com/…" },
  { type: "section", label: "Općenito" },
  { type: "text", name: "name", label: "Naziv lige", required: true },
  { type: "text", name: "tagline", label: "Slogan u naslovu preglednika", help: "Prikazuje se u kartici preglednika i na Googleu iza naziva lige." },
  { type: "textarea", name: "description", label: "Kratki opis za Google", required: true, rows: 2 },
  { type: "textarea", name: "footerText", label: "Tekst u podnožju", rows: 2 },
  { type: "text", name: "footerSlogan", label: "Slogan u dnu stranice" },
];

const button = (name: string, label: string): Field => ({
  type: "group", name, label,
  help: "Poveznica može biti stranica na ovom webu (npr. /raspored, /kontakt, /uzrasti/2015) ili cijela adresa (https://…).",
  fields: [
    { type: "text", name: "label", label: "Tekst na gumbu", required: true },
    { type: "text", name: "href", label: "Kamo vodi gumb", required: true },
  ],
});

export const homeFields: Field[] = [
  { type: "section", label: "Veliki naslov na vrhu", help: "Prvo što posjetitelj vidi na naslovnici." },
  {
    type: "group", name: "hero", label: "Naslovni dio",
    fields: [
      { type: "text", name: "eyebrow", label: "Mali natpis iznad naslova" },
      { type: "text", name: "title", label: "Naslov (prvi dio)", required: true },
      { type: "text", name: "titleHighlight", label: "Naslov (istaknuti dio)", help: "Prikazuje se crveno, iza prvog dijela." },
      { type: "textarea", name: "text", label: "Tekst ispod naslova", rows: 3 },
      button("primaryButton", "Prvi gumb"),
      button("secondaryButton", "Drugi gumb"),
    ],
  },
  { type: "section", label: "Sekcije na naslovnici", help: "Obavijesti uređujete u „Obavijesti (Aktualno)”, a fotografije u „Galerija”." },
  {
    type: "group", name: "featuredGallery", label: "Istaknuta galerija (npr. Kup grada Skradina)",
    help: "Prikazuje fotografije kojima ste u Galeriji uključili „Istaknuta galerija”.",
    fields: [
      { type: "toggle", name: "show", label: "Prikaži ovu sekciju" },
      { type: "text", name: "eyebrow", label: "Mali natpis iznad naslova" },
      { type: "text", name: "title", label: "Naslov", required: true },
      { type: "textarea", name: "text", label: "Tekst", rows: 2 },
    ],
  },
  heading("schedule", "Raspored utakmica"),
  heading("ageGroups", "Uzrasti"),
  heading("gallery", "Galerija na dnu naslovnice", "Prikazuje do 5 fotografija kojima ste u Galeriji uključili „Na naslovnici”."),
];

export const announcementFields: Field[] = [
  {
    type: "list", name: "items", label: "Obavijesti", itemLabel: "Obavijest", addLabel: "Dodaj novu obavijest", titleField: "title",
    help: "Obavijesti se na naslovnici prikazuju ovim redoslijedom. Strelicama mijenjate redoslijed.",
    newItem: { id: "", visible: true, style: "light", title: "", text: "", highlight: "", contactText: "Za prijave i dodatne informacije javite se na", buttonLabel: "Prijave i informacije", buttonLink: "/kontakt", image: null, posterTop: "", posterTitle: "", posterBottom: "", posterNumber: "" },
    fields: [
      { type: "toggle", name: "visible", label: "Prikaži na stranici", help: "Isključite da sakrijete obavijest bez brisanja." },
      { type: "text", name: "title", label: "Naslov", required: true },
      { type: "textarea", name: "text", label: "Tekst obavijesti", rows: 5, help: paragraphsHelp },
      { type: "text", name: "highlight", label: "Istaknuta rečenica (podebljano)", help: "Može ostati prazno." },
      { type: "text", name: "contactText", label: "Rečenica prije e-mail adrese", help: "Iza ove rečenice automatski se dodaje e-mail adresa lige. Ostavite prazno ako ne treba." },
      { type: "text", name: "buttonLabel", label: "Tekst na gumbu", help: "Ostavite prazno ako ne želite gumb." },
      { type: "text", name: "buttonLink", label: "Kamo vodi gumb", help: "Npr. /kontakt ili https://…" },
      { type: "select", name: "style", label: "Izgled", required: true, options: [{ value: "light", label: "Svijetla pozadina, slika lijevo" }, { value: "dark", label: "Tamna pozadina, plakat desno" }] },
      { type: "image", name: "image", label: "Slika ili plakat (nije obavezno)", help: "Ako ne dodate sliku, prikazuje se plavi plakat s tekstom iz polja ispod." },
      { type: "text", name: "posterTop", label: "Plakat: mali gornji tekst" },
      { type: "textarea", name: "posterTitle", label: "Plakat: veliki tekst", rows: 2, help: "Novi red = novi redak na plakatu." },
      { type: "text", name: "posterBottom", label: "Plakat: mali donji tekst" },
      { type: "text", name: "posterNumber", label: "Plakat: veliki broj u pozadini", help: "Samo za svijetli izgled, npr. 26. Može ostati prazno." },
    ],
  },
];

export const galleryFields: Field[] = [
  {
    type: "list", name: "images", label: "Fotografije", itemLabel: "Fotografija", addLabel: "Dodaj fotografiju", titleField: "alt", layout: "grid", bulkImages: "image",
    help: "Redoslijed ovdje je redoslijed u galeriji na stranici.",
    newItem: { id: "", alt: "", homepage: false, featured: false },
    fields: [
      { type: "image", name: "image", label: "Fotografija", required: true },
      { type: "textarea", name: "alt", label: "Kratki opis fotografije", required: true, rows: 2, help: "Što je na slici? Važno za slijepe osobe i Google." },
      { type: "toggle", name: "homepage", label: "Na naslovnici" },
      { type: "toggle", name: "featured", label: "Istaknuta galerija" },
    ],
  },
];

export const aboutFields: Field[] = [
  hero("hero", "Zaglavlje stranice", "Tamni dio na vrhu stranice O nama."),
  { type: "section", label: "Lijevi stupac" },
  { type: "text", name: "eyebrow", label: "Mali natpis" },
  { type: "text", name: "heading", label: "Naslov", required: true },
  {
    type: "group", name: "image", label: "Fotografija",
    fields: [
      { type: "image", name: "photo", label: "Fotografija", required: true },
      { type: "text", name: "alt", label: "Kratki opis fotografije", required: true },
    ],
  },
  { type: "section", label: "Priča" },
  { type: "textarea", name: "text", label: "Tekst prije citata", rows: 8, help: paragraphsHelp },
  { type: "textarea", name: "quote", label: "Citat", rows: 2, help: "Bez navodnika — dodaju se automatski." },
  { type: "textarea", name: "textAfterQuote", label: "Tekst nakon citata", rows: 4, help: paragraphsHelp },
  {
    type: "list", name: "values", label: "Vrijednosti (kartice)", itemLabel: "Vrijednost", addLabel: "Dodaj vrijednost", titleField: "title",
    newItem: { title: "", text: "" },
    fields: [
      { type: "text", name: "title", label: "Naslov", required: true },
      { type: "textarea", name: "text", label: "Tekst", rows: 2 },
    ],
  },
];

export const contactPageFields: Field[] = [
  hero("hero", "Zaglavlje stranice", "Tamni dio na vrhu stranice Kontakt."),
  { type: "section", label: "Lijevi dio", help: "Kontakt podatke (telefon, e-mail…) mijenjate u „Kontakt podaci”." },
  { type: "text", name: "eyebrow", label: "Mali natpis" },
  { type: "text", name: "heading", label: "Naslov", required: true },
  { type: "textarea", name: "text", label: "Tekst", rows: 2 },
  { type: "section", label: "Kartica desno" },
  { type: "text", name: "cardEyebrow", label: "Mali natpis" },
  { type: "text", name: "cardHeading", label: "Naslov", required: true },
  { type: "textarea", name: "cardText", label: "Tekst", rows: 3 },
  { type: "text", name: "cardNote", label: "Napomena (sitni tekst)" },
];

export const privacyFields: Field[] = [
  hero("hero", "Zaglavlje stranice", "Tamni dio na vrhu stranice Privatnost."),
  { type: "text", name: "updated", label: "Posljednje ažuriranje", help: "Npr. 28. kolovoza 2026." },
  { type: "textarea", name: "intro", label: "Uvodni tekst", rows: 3, help: paragraphsHelp },
  {
    type: "list", name: "sections", label: "Odlomci", itemLabel: "Odlomak", addLabel: "Dodaj odlomak", titleField: "title",
    newItem: { title: "", text: "" },
    fields: [
      { type: "text", name: "title", label: "Naslov odlomka", required: true },
      { type: "textarea", name: "text", label: "Tekst", rows: 4, help: paragraphsHelp },
    ],
  },
];

export const pagesFields: Field[] = [
  hero("schedule", "Stranica Raspored – zaglavlje", "Tamni dio na vrhu stranice Raspored."),
  hero("gallery", "Stranica Galerija – zaglavlje", "Tamni dio na vrhu stranice Galerija."),
  heading("ageGroup", "Stranice uzrasta – uvod", "Tekst iznad rasporeda na svakoj stranici uzrasta. Naslov i opis pojedinog uzrasta uređujete u „Uzrasti”."),
  heading("emptySchedule", "Poruka kad raspored još nije objavljen"),
];
