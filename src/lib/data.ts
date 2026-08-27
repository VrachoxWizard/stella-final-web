import type { Announcement, GalleryImage, Sponsor } from "@/lib/types";

export const announcements: Announcement[] = [
  {
    id: "skradin-2026",
    type: "tournament",
    title: "Kup grada Skradina",
    excerpt: "Prijavite se na Kup grada Skradina od 15. do 22. listopada i doživite uzbudljive utakmice, sportsko nadmetanje i odlično druženje.",
    image: "/images/Kup-grada-Skradina-2026.jpeg",
    date: "2026-10-15",
    cta: { label: "Prijave i informacije", href: "/kontakt" },
  },
  {
    id: "league-registration-2026",
    type: "news",
    title: "Prijave za Malonogometnu ligu",
    excerpt: "Malonogometna liga počinje 19. rujna u ŠC Hotanj na Zagrebačkom velesajmu i namijenjena je nogometašima rođenima od 2015. do 2020. godine.",
    image: "/images/Naslovna-fotka-2.jpg",
    date: "2026-09-19",
    cta: { label: "Prijave i informacije", href: "/kontakt" },
  },
];

export const gallery: GalleryImage[] = [
  { id: "g1", src: "/images/WhatsApp-Image-2026-02-09-at-20.58.08.jpeg", alt: "Večernja utakmica mladih nogometaša na osvijetljenom terenu DSR Trnovčica", width: 1079, height: 894 },
  { id: "g2", src: "/images/Naslovna-fotka-2.jpg", alt: "Nogometna lopta u mreži uz grb Tina Šport lige", width: 1920, height: 1281 },
  { id: "g3", src: "/images/pexels-pixabay-262524.jpg", alt: "Nogometna momčad okupljena prije utakmice", width: 1920, height: 1280 },
  { id: "g4", src: "/images/pexels-sergio-souza-9735734.jpg", alt: "Pogled iz zraka na nogometni stadion", width: 1920, height: 1080 },
  { id: "g5", src: "/images/Kup-grada-Skradina-2026.jpeg", alt: "Službeni plakat nogometnog turnira Kup grada Skradina 2026", width: 1024, height: 1536 },
  { id: "g6", src: "/images/WhatsApp-Image-2026-03-12-at-09.34.13-1.jpeg", alt: "Pogled na bazene i smještaj sudionika Kupa grada Skradina", width: 1000, height: 667 },
  { id: "g7", src: "/images/WhatsApp-Image-2026-03-12-at-09.34.13-2.jpeg", alt: "Večernji pogled na bazen i hotelski kompleks tijekom Kupa grada Skradina", width: 1000, height: 667 },
  { id: "g8", src: "/images/WhatsApp-Image-2026-03-12-at-09.34.14.jpeg", alt: "Hotelska soba s plavim muralom za sudionike sportskog putovanja", width: 1600, height: 1066 },
  { id: "g9", src: "/images/WhatsApp-Image-2026-03-12-at-09.34.14-1.jpeg", alt: "Smještaj pripremljen za mlade sudionike turnira", width: 1599, height: 1066 },
  { id: "g10", src: "/images/WhatsApp-Image-2026-03-12-at-09.34.14-2.jpeg", alt: "Zajedničko kupanje i odmor tijekom turnirskog putovanja", width: 2048, height: 1152 },
  { id: "g11", src: "/images/WhatsApp-Image-2026-03-12-at-09.34.14-3.jpeg", alt: "Zajednički prostor hotela za sudionike Kupa grada Skradina", width: 1600, height: 1066 },
  { id: "g12", src: "/images/WhatsApp-Image-2026-08-18-at-12.11.37.jpeg", alt: "Kup grada Skradina — bazen uz more s ležaljkama i borovima", width: 1620, height: 1080 },
  { id: "g13", src: "/images/WhatsApp-Image-2026-08-18-at-12.11.37-1.jpeg", alt: "Kup grada Skradina — šljunčana plaža s ležaljkama u hladu borova", width: 2048, height: 1365 },
  { id: "g14", src: "/images/WhatsApp-Image-2026-08-18-at-12.11.37-2.jpeg", alt: "Kup grada Skradina — svježe voće na doručku za sudionike", width: 2040, height: 1536 },
  { id: "g15", src: "/images/WhatsApp-Image-2026-08-18-at-12.11.37-3.jpeg", alt: "Kup grada Skradina — vanjski lounge s pogledom na more", width: 1620, height: 1080 },
  { id: "g16", src: "/images/WhatsApp-Image-2026-08-18-at-12.11.37-4.jpeg", alt: "Kup grada Skradina — poslastice poslužene sudionicima turnira", width: 2040, height: 1536 },
  { id: "g17", src: "/images/WhatsApp-Image-2026-08-18-at-12.11.38.jpeg", alt: "Kup grada Skradina — recepcija i lobby smještaja za sudionike", width: 2048, height: 1366 },
  { id: "g18", src: "/images/WhatsApp-Image-2026-08-18-at-12.11.38-1.jpeg", alt: "Kup grada Skradina — topli obrok na buffet stolu", width: 2040, height: 1536 },
  { id: "g19", src: "/images/WhatsApp-Image-2026-08-18-at-12.11.38-2.jpeg", alt: "Kup grada Skradina — sauna za odmor nakon utakmica", width: 2048, height: 1365 },
  { id: "g20", src: "/images/WhatsApp-Image-2026-08-18-at-12.11.38-3.jpeg", alt: "Kup grada Skradina — večernja terasa s pogledom na more", width: 720, height: 1080 },
  { id: "g21", src: "/images/WhatsApp-Image-2026-08-18-at-12.11.38-4.jpeg", alt: "Kup grada Skradina — doručak i ručak na self-service stolu", width: 2040, height: 1536 },
  { id: "g22", src: "/images/WhatsApp-Image-2026-08-18-at-12.11.38-5.jpeg", alt: "Kup grada Skradina — hotel s bazenom i ležaljkama", width: 1024, height: 640 },
  { id: "g23", src: "/images/WhatsApp-Image-2026-08-18-at-12.11.39.jpeg", alt: "Kup grada Skradina — trofeji i medalje prije dodjele nagrada", width: 2040, height: 1536 },
  { id: "g24", src: "/images/WhatsApp-Image-2026-08-18-at-12.11.39-1.jpeg", alt: "Kup grada Skradina — dvokrevetna soba za mlade sudionike", width: 2048, height: 1323 },
  { id: "g25", src: "/images/WhatsApp-Image-2026-08-18-at-12.11.39-2.jpeg", alt: "Kup grada Skradina — pečeni krumpir i meso na buffet stolu", width: 2040, height: 1536 },
  { id: "g26", src: "/images/WhatsApp-Image-2026-08-18-at-12.11.39-3.jpeg", alt: "Kup grada Skradina — balkon s cvijećem i pogledom na more", width: 720, height: 1080 },
  { id: "g27", src: "/images/WhatsApp-Image-2026-08-18-at-12.11.39-4.jpeg", alt: "Kup grada Skradina — pogled s balkona na more i jedrilicu", width: 1334, height: 2000 },
  { id: "g28", src: "/images/WhatsApp-Image-2026-08-18-at-12.11.39-5.jpeg", alt: "Kup grada Skradina — moderna hotelska soba za sudionike", width: 2048, height: 1251 },
  { id: "g29", src: "/images/WhatsApp-Image-2026-08-18-at-12.11.39-6.jpeg", alt: "Kup grada Skradina — Hotel Punta, domaćin turnirskog vikenda", width: 2048, height: 1349 },
  { id: "g30", src: "/images/WhatsApp-Image-2026-08-18-at-12.11.39-7.jpeg", alt: "Kup grada Skradina — restoran spreman za zajednički obrok", width: 2048, height: 1365 },
  { id: "g31", src: "/images/WhatsApp-Image-2026-08-18-at-12.11.40.jpeg", alt: "Kup grada Skradina — doručak na toplom stolu za ekipe", width: 1600, height: 1200 },
  { id: "g32", src: "/images/WhatsApp-Image-2026-08-18-at-12.11.40-1.jpeg", alt: "Kup grada Skradina — hotel i sunčana terasa uz more", width: 2000, height: 1334 },
  { id: "g33", src: "/images/WhatsApp-Image-2026-08-18-at-12.11.40-2.jpeg", alt: "Kup grada Skradina — terasa s ležaljkama i pogledom na more", width: 2000, height: 1334 },
  { id: "g34", src: "/images/WhatsApp-Image-2026-08-18-at-12.11.40-3.jpeg", alt: "Kup grada Skradina — panoramski pogled na obalu i smještaj", width: 1024, height: 575 },
];

export const skradinGallery = gallery.filter((image) => ["g12", "g13", "g23", "g29", "g32", "g34"].includes(image.id));

export const sponsorFallback: Sponsor = {
  name: "Poliklinika Ribnjak",
  image: "/images/DOC-20240309-WA0010_240729_164917_page-00012-scaled.jpg",
  width: 2560,
  height: 853,
  alt: "Poliklinika Ribnjak, službeni sponzor Tina Šport–Pia lige",
  description: "Poliklinika Ribnjak podržava natjecanje i razvoj mladih sportaša — na terenu i izvan njega.",
};

export const site = {
  name: "Tina Šport–Pia",
  description: "Malonogometna liga za djecu i mlade u Zagrebu — raspored, rezultati, tablice i galerija.",
  email: "mnl.tinasport@gmail.com",
  phone: "092 2859 555",
  phoneHref: "+385922859555",
  address: "Remetinečka cesta 7/II, 10000 Zagreb",
  organizer: "Nikola Zorotić",
  facebook: "https://www.facebook.com/Mnltinasport",
  instagram: "https://www.instagram.com/mnl.tinasport_pia/",
};
