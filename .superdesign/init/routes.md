# Route Map — Next.js App Router

| Public URL | Entry file | Primary content |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | Hero match ticket, fixture rail, age navigator, feature story, film, sponsor, gallery preview |
| `/raspored` | `src/app/raspored/page.tsx` | Schedule hero, age filters, date groups, match cards |
| `/uzrasti/[year]` | `src/app/uzrasti/[year]/page.tsx` | 2015/2016/2017/2019 competition view with table, results, and scorers |
| `/galerija` | `src/app/galerija/page.tsx` | Gallery hero, matchday film, editorial image grid/lightbox |
| `/o-nama` | `src/app/o-nama/page.tsx` | History since 1992, organizer story, quote, values, community image |
| `/kontakt` | `src/app/kontakt/page.tsx` | Organizer/contact details, socials, functional Formspree form |
| `/privatnost` | `src/app/privatnost/page.tsx` | Readable privacy information |

All pages use `src/app/layout.tsx`, `SiteHeader`, and `SiteFooter`.

Legacy WordPress redirects remain configured in `next.config.ts` for `/raspored-utakmica/`, `/uzrast-2015/`, `/uzrast-2016/`, `/uzrast-2017/`, `/uzrast-2019/`, `/kontrakt/`, and trailing-slash equivalents. Designs must not introduce new URLs or remove current public routes.
