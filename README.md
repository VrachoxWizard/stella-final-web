# Tina Šport–Pia

Moderni React/Next.js nasljednik postojeće WordPress stranice. Dizajn prati odobreni **Cinematic editorial matchday** smjer, a javni dio radi i bez CMS pristupa koristeći provjereni lokalni sadržaj.

## Pokretanje

```bash
npm install
npm run dev
```

Otvorite `http://localhost:3000`. Administracija sadržaja dostupna je na `/studio` nakon povezivanja Sanity projekta.

## Okruženje

Kopirajte `.env.example` u `.env.local` i unesite:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` i `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN` za sigurni pregled nacrta na poslužitelju
- `SANITY_REVALIDATE_SECRET` za preview i publication webhook
- `NEXT_PUBLIC_FORMSPREE_FORM_ID` za isporuku kontaktnih poruka
- `NEXT_PUBLIC_SITE_URL` za kanonske URL-ove

Bez ovih vrijednosti stranica koristi lokalni sadržaj i ne šalje obrazac vanjskom servisu.

## Sanity

1. Kreirajte Sanity projekt i dataset `production`.
2. Unesite varijable okruženja.
3. Pokrenite `npm run sanity:seed` za unos postavki, sezone, uzrasta, momčadi, igrača, utakmica, objava i galerije.
4. U Sanity webhooku postavite `POST /api/revalidate` i zaglavlje `x-sanity-secret`.
5. Draft pregled uključuje se kroz `/api/draft/enable?secret=...&redirect=/...`.

## Provjera

```bash
npm run typecheck
npm run lint
npm test
npm run e2e
npm run build
```

End-to-end provjera pokriva sve javne rute i trajna preusmjerenja na mobilnom, tablet i desktop prikazu. Testovi uključuju automatsku provjeru ozbiljnih problema pristupačnosti i horizontalnog preljeva.

## Objavljivanje

Projekt je spreman za Vercel. Prije produkcijskog prebacivanja domene potrebno je u Vercelu unijeti sve varijable okruženja, provjeriti Formspree isporuku, uvesti odobreni Sanity sadržaj i potvrditi završni tekst privatnosti. Stari WordPress host treba ostati dostupan tijekom početnog razdoblja nakon prebacivanja.
