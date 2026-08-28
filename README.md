# Tina Šport–Pia

Next.js 16 web za Malonogometnu ligu Tina Šport–Pia. Natjecateljski sadržaj uređuje se kroz TinaCMS, sprema kao JSON u ovaj GitHub repozitorij i ulazi u javni web tek tijekom uspješnog Vercel builda.

## Lokalno pokretanje

```bash
npm install
npm run dev
```

- web: `http://localhost:3000`
- TinaCMS: `http://localhost:3000/admin`

U lokalnom načinu Tina radi nad datotekama u `content/competition`. Za uređivanje na objavljenom webu potrebno je povezati TinaCloud projekt.

## Varijable okruženja

Kopirajte `.env.example` u `.env.local` i postavite:

- `NEXT_PUBLIC_TINA_CLIENT_ID` — ID TinaCloud projekta
- `TINA_TOKEN` — read-only token, samo u lokalnom/Vercel okruženju
- `NEXT_PUBLIC_TINA_BRANCH` — zadano `main`
- `NEXT_PUBLIC_SITE_URL` — kanonska adresa, `https://mnk-tinasport.hr`

Kontaktni obrazac privremeno nije uključen; posjetitelji se javljaju izravno e-mailom ili telefonom. Integracija obrasca može se dodati naknadno.

Pristupni podaci i tokeni ne smiju se commitati.

## CMS sadržaj

- `content/competition/seasons`
- `content/competition/age-groups`
- `content/competition/teams`
- `content/competition/players`
- `content/competition/matches`

Utakmice imaju vidljivost `draft` ili `public`. Javni web prikazuje samo javne utakmice aktivne sezone, aktivnih uzrasta i aktivnih klubova. Cjelovita validacija odnosa izvršava se tijekom builda; neispravni dokument zaustavlja novi deployment.

## Provjera

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run e2e
```

Build naredba je `tinacms build && next build`. Generirani `tina/tina-lock.json` mora ostati u repozitoriju.

## Objava

Vercel projekt koristi Next.js preset, `npm install`, `npm run build` i granu `main`. Postojeći WordPress ostaje na TotoHostu kao arhiva i medijski origin; detaljan redoslijed prijelaza nalazi se u [docs/migration-runbook.md](docs/migration-runbook.md).
