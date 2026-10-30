# Tina Šport–Pia — web stranica

Web stranica Malonogometne lige Tina Šport–Pia. Sadržaj se uređuje kroz jednostavno sučelje na adresi **/admin**.

- [Upute za urednike](#upute-za-urednike) — kako mijenjati stranicu
- [Jednokratno postavljanje](#jednokratno-postavljanje-za-administratora) — samo za administratora
- [Za programere](#za-programere)

---

## Upute za urednike

### Prijava

1. Otvorite **https://mnk-tinasport.hr/admin**
2. Upišite lozinku i kliknite **Prijavi se**.
3. Otvara se **Početna ploča** s velikim pločicama. Kliknite ono što želite urediti.

Prijava traje 12 sati. Kad završite, kliknite **Odjava** (gore desno).

### Važno za svako uređivanje

- Nakon izmjene **uvijek kliknite plavi gumb „Spremi promjene”** na dnu ekrana.
- Zelena poruka **„Spremljeno!”** znači da je sve u redu.
- Promjena se na javnoj stranici pojavi za **otprilike 2 minute**. Ako je ne vidite, pričekajte pa osvježite stranicu (tipka F5).
- Crvena poruka znači da nešto nije ispravno upisano. Pročitajte je, ispravite i spremite ponovno. **Ništa se nije pokvarilo** — stranica ostaje kakva je bila.
- Polja sa zvjezdicom (*) su obavezna.
- Ne spremajte svaku sitnicu zasebno: napravite sve izmjene na jednoj stranici pa kliknite „Spremi” jednom.

### Upisati rezultat utakmice

1. Početna ploča → **Utakmice i rezultati**
2. Kod utakmice kliknite **Upiši rezultat**.
3. Upišite **Golove domaćina** i **Golove gosta**.
4. (Nije obavezno) Kliknite **Dodaj strijelca**, odaberite igrača s popisa i broj golova. Ako igrača nema na popisu, upišite ime u polje „…ili upišite ime” i odaberite klub.
5. Kliknite **Spremi promjene**.

Status utakmice automatski postaje „Odigrana”, a tablica i strijelci se sami izračunaju.

### Dodati novu utakmicu

1. **Utakmice i rezultati** → **Nova utakmica**
2. Odaberite **uzrast**, upišite **datum** i **vrijeme**, odaberite **domaćina** i **gosta**, upišite **igralište** i **kolo** (npr. „1. kolo”).
3. Kliknite **Spremi utakmicu**.

Prekidač **„Prikaži na stranici”** određuje vidi li se utakmica javno. Isključite ga ako utakmicu još ne želite objaviti.

> Ako u izborniku nema kluba, prvo ga dodajte: Početna ploča → **Klubovi** → **Novi klub** (upišite naziv i označite uzraste u kojima igra).

### Obavijesti na naslovnici („Aktualno”)

1. Početna ploča → **Obavijesti (Aktualno)**
2. Promijenite tekst postojeće obavijesti ili kliknite **Dodaj novu obavijest** na dnu.
3. Strelicama ↑ ↓ mijenjate redoslijed, kantom 🗑 brišete.
4. Za privremeno skrivanje isključite **„Prikaži na stranici”** (obavijest ostaje spremljena).
5. **Spremi promjene**.

Za novi odlomak u tekstu ostavite jedan prazan red.

### Galerija

1. Početna ploča → **Galerija**
2. Kliknite **Dodaj fotografije** i odaberite jednu ili više slika (mogu i s mobitela). Slike se automatski smanjuju.
3. Kod svake nove fotografije upišite **kratki opis** (što je na slici).
4. **Na naslovnici** = prikazuje se na dnu naslovnice. **Istaknuta galerija** = prikazuje se u sekciji „Skradin u srcu”.
5. **Spremi promjene**.

Ako dodajete puno fotografija, dodajte ih u nekoliko manjih navrata (do ~10 odjednom).

### Ostalo

| Što želite promijeniti | Gdje |
|---|---|
| Telefon, e-mail, adresu, Facebook, Instagram | **Kontakt podaci** |
| Veliki naslov na vrhu naslovnice | **Naslovna stranica** |
| Tekst „O nama”, citat, fotografiju | **O nama** |
| Tekstove na stranici Kontakt | **Stranica Kontakt** |
| Zaglavlja stranica Raspored i Galerija | **Ostali tekstovi** |
| Tekst o privatnosti | **Privatnost** |
| Novo godište (npr. 2021) | **Uzrasti** → Novi uzrast |
| Novu sezonu i bodovanje | **Sezone** → Nova sezona |

### Ako nešto ne radi

- **„Lozinka nije točna”** — provjerite velika/mala slova. Nakon 8 krivih pokušaja pričekajte 15 minuta.
- **„Ne može se obrisati jer se još koristi”** — npr. klub koji ima utakmice ne može se obrisati. Isključite mu „Klub je aktivan” umjesto brisanja.
- **„GitHub token nije ispravan ili je istekao”** — javite se administratoru.
- Za sve ostalo javite se administratoru. Svaka spremljena promjena čuva se u povijesti, pa se uvijek može vratiti.

---

## Jednokratno postavljanje (za administratora)

CMS sprema promjene u ovaj GitHub repozitorij, a Vercel nakon svake promjene sam objavi novu verziju stranice. Za to su potrebne 3 stvari: **lozinka**, **tajni niz** i **GitHub token**.

### 1. GitHub token

1. Na GitHubu: slika profila (gore desno) → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
2. **Token name:** `CMS stranice`
3. **Expiration:** 1 godina (zapišite datum — token tada treba obnoviti).
4. **Repository access:** *Only select repositories* → `stella-final-web`
5. **Permissions** → **Repository permissions** → **Contents** → **Read and write**.
6. **Generate token** i kopirajte ga (vidi se samo jednom).

### 2. Varijable na Vercelu

Vercel → projekt → **Settings** → **Environment Variables**. Dodajte (za *Production* i *Preview*):

| Naziv | Vrijednost |
|---|---|
| `ADMIN_PASSWORD` | lozinka koju dajete urednicima (dugačka, npr. 3–4 riječi) |
| `SESSION_SECRET` | bilo koji nasumični niz od barem 32 znaka |
| `GITHUB_TOKEN` | token iz koraka 1 |
| `GITHUB_REPO` | `VrachoxWizard/stella-final-web` |
| `GITHUB_BRANCH` | `main` |
| `NEXT_PUBLIC_SITE_URL` | `https://mnk-tinasport.hr` |

Nasumični niz za `SESSION_SECRET` možete dobiti naredbom:
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

Obrišite stare varijable `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN` i `NEXT_PUBLIC_TINA_BRANCH`, te projekt na TinaCloudu (više se ne koristi).

Zatim **Deployments** → zadnji deployment → **⋯** → **Redeploy**.

### 3. Provjera

Otvorite `/admin`, prijavite se, promijenite neku sitnicu (npr. slogan u „Kontakt podaci”) i spremite. Za ~2 minute promjena mora biti na stranici, a u GitHubu se pojavljuje commit „CMS: …”.

### Promjena lozinke

Promijenite `ADMIN_PASSWORD` na Vercelu i napravite **Redeploy**. Svi koji su bili prijavljeni automatski se odjavljuju.

### Vraćanje stare verzije

Svaka promjena iz CMS-a je zaseban commit na GitHubu. Lošu promjenu poništite s **Revert** na tom commitu (ili na Vercelu → Deployments → stariji deployment → **Promote to Production**).

---

## Za programere

```bash
npm install
npm run dev
```

- web: http://localhost:3000, CMS: http://localhost:3000/admin
- Lokalno (bez `GITHUB_TOKEN`) CMS sprema izravno u datoteke u `content/` i `public/uploads/`. Za prijavu postavite `ADMIN_PASSWORD` i `SESSION_SECRET` u `.env.local` (vidi `.env.example`).

**Gdje je što**

- `content/site/*.json` — tekstovi stranica, obavijesti, galerija, kontakt podaci
- `content/competition/*` — sezone, uzrasti, klubovi, igrači, utakmice
- `src/lib/schemas.ts` — pravila ispravnosti sadržaja (koriste ih i build i CMS)
- `src/app/admin/` — CMS sučelje; `src/lib/cms/` — prijava, spremanje, GitHub
- `src/proxy.ts` — štiti sve `/admin` stranice

CMS prije spremanja provjerava sav sadržaj istim pravilima kao build, pa neispravan unos ne može srušiti deployment. Javna stranica ostaje statična.

**Provjere:** `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm run e2e`

Postojeći WordPress ostaje na TotoHostu kao arhiva i medijski origin; vidi [docs/migration-runbook.md](docs/migration-runbook.md).
