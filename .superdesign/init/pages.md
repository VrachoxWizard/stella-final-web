# Page Dependency Trees — Current Next.js Application

## `/` homepage

`src/app/page.tsx`
→ `SiteHeader` / `SiteFooter` from root layout
→ `AgeNavigation`
→ `MatchCard`
→ `MatchdayFilm`
→ `Reveal`
→ `SectionHeading`
→ `getMatches`, `getAnnouncements`, `getGallery`
→ `src/app/globals.css`

Current sections: full-height matchday hero, ticker, upcoming fixtures, age groups, single announcement feature, portrait matchday film, simulated sponsor panel, five-image gallery preview.

## `/raspored`

`src/app/raspored/page.tsx`
→ `PageHero`
→ `ScheduleView`
→ `MatchCard`
→ match content provider

## `/uzrasti/[year]`

`src/app/uzrasti/[year]/page.tsx`
→ `PageHero`
→ `AgeNavigation`
→ `CompetitionView`
→ match content provider and unchanged competition calculations

## `/galerija`

`src/app/galerija/page.tsx`
→ `PageHero`
→ `MatchdayFilm`
→ `GalleryGrid`
→ gallery content provider

## `/o-nama`

`src/app/o-nama/page.tsx`
→ `PageHero`
→ sticky story photograph
→ history copy, quote, and values cards

## `/kontakt`

`src/app/kontakt/page.tsx`
→ `PageHero`
→ contact details/socials
→ `ContactForm`

## `/privatnost`

`src/app/privatnost/page.tsx`
→ `PageHero`
→ long-form legal article

The homepage is the design approval surface. After approval, its header, footer, media treatment, typography, spacing, interactions, and responsive rules will form the whole-site system.
