# Shared Layouts — Current Next.js Application

## Root layout

Source: `src/app/layout.tsx`

- Croatian document language (`hr`).
- Preloads local Barlow Condensed font files.
- Provides skip link, sticky `SiteHeader`, `main#main-content`, and `SiteFooter` to every public route.
- Global metadata uses the real Tina Šport–Pia identity and `Naslovna-fotka-2.jpg` for social sharing.

## Site header

Source: `src/components/site-header.tsx`

- Sticky 88px dark-navy bar in the current application.
- Real circular Tina crest at left, league wordmark, desktop links, schedule CTA, and native-details mobile menu.
- Routes: Raspored, Uzrasti, Galerija, O nama, Kontakt.
- Current gaps that the redesign must solve: no route-aware active state and no direct accessible 2015/2016/2017/2019 submenu on desktop.

## Site footer

Source: `src/components/site-footer.tsx`

- Dark four-column layout with crest/mission, age links, information links, contact details, and social links.
- Current gaps that the redesign must solve: it lacks the photographic stadium character of the WordPress footer and needs stronger mobile hierarchy.

## Shell and spacing

- Shared `.shell` width: `min(100% - 48px, 1240px)`; 28px outer allowance on mobile.
- Shared `.section` vertical padding: fluid 72–120px range.
- Page heroes, sections, grids, and footer stay full-width, while readable content is constrained by the shell.

The redesign must preserve the root layout semantics and public route structure while applying one coherent visual system to all pages.
