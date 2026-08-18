# Shared UI Components — Current Next.js Application

The product is a Next.js 16 App Router application with React 19, TypeScript, vanilla global CSS, `next/image`, and Lucide icons. These are the reusable visual components currently used by the public routes.

## `AgeNavigation`

- Source: `src/components/age-navigation.tsx`
- Four links for 2015, 2016, 2017, and 2019, with `aria-current="page"` for the active age group.
- Existing visual contract: four large navy generation tiles on dark sections; responsive two-column layout on mobile.

## `MatchCard`

- Source: `src/components/match-card.tsx`
- Props: `match`, optional `compact`.
- Shows match status, age group, teams, score or kickoff time, date, venue, and competition link.
- Existing visual contract: white bordered card, strong condensed team/score typography, red status marker, compact metadata rows.

## `SectionHeading`

- Source: `src/components/section-heading.tsx`
- Props: eyebrow, title, optional copy, href, link label.
- Existing visual contract: editorial headline and optional right-aligned arrow link.

## `PageHero`

- Source: `src/components/page-hero.tsx`
- Props: eyebrow, title, copy, oversized background word, optional image.
- Uses `next/image` fill mode. The page title and copy remain real text above a dark cinematic image treatment.

## `MatchdayFilm`

- Source: `src/components/matchday-film.tsx`
- Client component with a 9:16 poster-led video frame.
- Playback is user initiated. The video has `preload="none"`, `playsInline`, a poster, and controls only after playback starts.

## `GalleryGrid`

- Source: `src/components/gallery-grid.tsx`
- Client component that renders a responsive editorial image grid and modal lightbox.
- Current keyboard support: close with Escape and focus the close button when opened.

## `Reveal`

- Source: `src/components/reveal.tsx`
- Visual wrapper for section/card entrance timing. It currently uses CSS animation delay.

## Route-specific interactive components

- `ScheduleView`: age filtering and grouped match lists.
- `CompetitionView`: tabs for table, results, and scorers.
- `ContactForm`: Formspree-backed contact form with fallback behavior.

When generating designs, preserve these component responsibilities, Croatian labels, real data hierarchy, and accessible semantics.
