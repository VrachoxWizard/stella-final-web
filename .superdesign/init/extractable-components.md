# Extractable Components — Current Next.js Application

## `SiteHeader`

- Category: layout
- Source: `src/components/site-header.tsx`
- Design props: `activeItem` default `home`; `menuOpen` default `false`.
- Hardcode: crest asset, Croatian labels, route map, 2015/2016/2017/2019 submenu labels.

## `SiteFooter`

- Category: layout
- Source: `src/components/site-footer.tsx`
- Design props: `currentYear` default `2026`.
- Hardcode: crest, contact details, route labels, social labels, stadium background treatment.

## `PageHero`

- Category: layout
- Source: `src/components/page-hero.tsx`
- Design props: title, eyebrow, copy, word, image URL; all with non-empty defaults.

## `SectionHeading`

- Category: basic
- Source: `src/components/section-heading.tsx`
- Design props: eyebrow, title, copy, link label, link URL; all with defaults.

## `MatchCard`

- Category: basic
- Source: `src/components/match-card.tsx`
- Design props: status, age, home team, away team, date, time, venue, compact flag; all with defaults.

## `AgeNavigation`

- Category: navigation
- Source: `src/components/age-navigation.tsx`
- Design prop: active age default `2015`.
- Hardcode: 2015, 2016, 2017, 2019 labels and routes.

## `MatchdayFilm`

- Category: layout
- Source: `src/components/matchday-film.tsx`
- Design prop: started default `false`.
- Hardcode: title, metadata, portrait poster, real media path, accessible play label.

## `GalleryGrid`

- Category: layout
- Source: `src/components/gallery-grid.tsx`
- Design props: selected image default first item; dialog open default `false`.
- Hardcode: representative image set, navigation icons, close icon.

These are the reusable candidates for the Superdesign canvas. The generated homepage may compose them but must not invent new application routes or competition data structures.
