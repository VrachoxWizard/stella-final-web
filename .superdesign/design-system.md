# Tina Šport–Pia Cinematic Matchday Design System

## Product and fidelity

Tina Šport–Pia is a Croatian youth futsal league founded in 1992. The redesign is a modern cinematic reinterpretation of the still-running WordPress site, not a generic sports template and not a literal Divi reconstruction. It must remain unmistakably Tina Šport–Pia through the real crest, navy/red identity, original match photography, actual Poliklinika Ribnjak sponsor artwork, Croatian content, and the legacy information sequence.

The public jobs are checking the next match, finding a schedule, switching among 2015/2016/2017/2019, reading results/standings/scorers, seeing announcements, watching the league film by choice, browsing photographs, and contacting the organizer.

## Approved exploration directions

### Modern Legacy Cinema — default candidate

Recognizable WordPress imagery and content order, transformed into an editorial sports-film composition. Preserve generous photography on desktop and mobile, the crest, sponsor banner, match information, and hard-edged legacy cues. Use alternating navy, warm paper, and white bands; strong condensed headlines; asymmetrical grids; fine red rules; subtle one-time motion; and clear competition UX.

### Immersive Matchday Film — alternative candidate

A darker, media-led interpretation. Give the poster-led 9:16 film stronger visual dominance after the match information while keeping the same user-controlled playback, real photographs, routes, content, and accessible hierarchy. It may use deeper navy/black spatial rhythm but may not autoplay, obscure core navigation, or turn the experience into an entertainment splash screen.

## Color tokens

- Ink navy `#07162f`: primary dark canvas and high-contrast text
- Deep navy `#0d2144`: tonal dark surface
- Legacy blue `#183885`: explicit bridge to the WordPress identity and interactive accents
- Match red `#da251e`: primary action, current state, and thin editorial rules
- Warm paper `#f4f1ea`: main light canvas
- Pure white `#ffffff`: cards, text, and sponsor frame
- Ink `#101c30`: body text on light backgrounds
- Muted ink `#637086`: secondary metadata
- Border light `#d9dee8`; border dark `rgba(255,255,255,.15)`
- Pitch green `#2f7d50`: played/success status only
- Gold `#f4c95d`: rare tournament highlight only

Allowed gradients are tonal overlays made only from navy, transparent navy/black, white transparency, and restrained red transparency. Do not introduce purple, pink, cyan, neon, or unrelated colors.

## Typography

- Headlines, scores, teams, and large numerals: Barlow Condensed 700–800.
- Body, navigation, labels, forms, and tabular data: Inter 400–800.
- Desktop display: 64–118px. Mobile display: 44–64px. Body: 16–18px. Metadata: 12–14px.
- Use uppercase for compact labels and match metadata, not for long paragraphs. Preserve Croatian diacritics.

## Layout and shape

- Content width: maximum 1240px; responsive gutters 24px desktop and 14px minimum mobile.
- Use full-width cinematic sections with strong editorial grids, crisp rules, intentional whitespace, and generous image surfaces.
- Standard cards use 0–16px radius; archival/legacy bands and sponsor artwork may be square. Avoid pill-heavy UI, glassmorphism, glossy esports effects, and large generic shadow stacks.
- Buttons are solid red/white or high-contrast outlined navy/white, minimum 44px height, with visible focus states.
- Match data remains quick to scan. On mobile, use cards or controlled scrolling rather than compressed unreadable tables.

## Real asset map

Use real supplied assets, never redrawn substitutes:

- Crest: `Tina-logo-cisti.png` — Superdesign URL: `https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/brand/f1bb4562-c133-48d9-aec3-30617888f49f/assets/d87b1be5-11e3-48b6-bf9d-a561180ddaad.png`
- Homepage hero: `Naslovna-fotka-2.jpg`, documentary football crop visible on desktop and mobile — Superdesign URL: `https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/projects/9e9cca81-883c-4593-8486-0b22c271bbf7/external-assets/013e225c-df6c-455d-9483-2bdf8a11350c-Naslovna-fotka-2.jpg`
- Raštane Cup poster: `WhatsApp-Image-2026-03-12-at-09.34.13.jpeg` — Superdesign URL: `https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/brand/f1bb4562-c133-48d9-aec3-30617888f49f/assets/d454e71d-50bf-44fe-9752-4c36f4fff9df.jpg`
- Raštane supporting mosaic: use only the following six real resort/accommodation photographs; do not substitute the DSR image, hero, film poster, sponsor, crest, or stadium image:
  - Pool/resort aerial: `https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/brand/f1bb4562-c133-48d9-aec3-30617888f49f/assets/3639a478-5253-44c1-8e3a-b665be80b32c.jpg`
  - Pool complex at dusk: `https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/brand/f1bb4562-c133-48d9-aec3-30617888f49f/assets/9d9bab5e-8271-40bf-a978-2facfafc9590.jpg`
  - Hotel room with blue accents: `https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/brand/f1bb4562-c133-48d9-aec3-30617888f49f/assets/9ffee81c-bc0f-4fa0-b708-6db09dd8b21c.jpg`
  - Hotel room with blue mural: `https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/brand/f1bb4562-c133-48d9-aec3-30617888f49f/assets/96fc6da2-e6f0-4f32-87dc-d738460920a1.jpg`
  - Blue restaurant interior: `https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/brand/f1bb4562-c133-48d9-aec3-30617888f49f/assets/68057a42-7de5-486f-9f71-8034e54e9e42.jpg`
  - Daytime community pool: `https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/brand/f1bb4562-c133-48d9-aec3-30617888f49f/assets/c1a41105-afb0-485c-8af8-8ea2045facc4.jpg`
- DSR Trnovčica: `WhatsApp-Image-2026-02-09-at-20.58.08.jpeg` — Superdesign URL: `https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/brand/f1bb4562-c133-48d9-aec3-30617888f49f/assets/0403c22c-c20f-4375-831f-769060fa5f9d.jpg`
- Sponsor: `DOC-20240309-WA0010_240729_164917_page-00012-scaled.jpg`, shown uncropped — Superdesign URL: `https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/brand/f1bb4562-c133-48d9-aec3-30617888f49f/assets/28deac43-52e1-4b55-922a-4859a83b7c01.jpg`
- Film: `Video-by-klincek__.mp4`, 43.2 seconds, vertical 9:16, with `video-matchday-poster.jpg` fallback — poster Superdesign URL: `https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/projects/9e9cca81-883c-4593-8486-0b22c271bbf7/external-assets/845d4abc-bcbe-4a86-b4fb-9a261c1ca34b-video-matchday-poster.jpg`
- Photographic footer: `pexels-pixabay-262524.jpg` with restrained navy overlay — Superdesign URL: `https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/projects/9e9cca81-883c-4593-8486-0b22c271bbf7/external-assets/1ad1556f-8484-4fe3-9ba2-cf8ed2d51cf6-pexels-pixabay-262524.jpg`
- Live WordPress screenshot reference: `https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/brand/f1bb4562-c133-48d9-aec3-30617888f49f/screenshot.png`

## Homepage architecture

1. Sticky compact header: real crest, current-route state, direct accessible age submenu, schedule CTA, mobile navigation.
2. Hero: `Naslovna-fotka-2.jpg`, league identity and intro, schedule/results CTAs, compact featured-match ticket, subtle optional crest watermark.
3. Continuous existing ticker, then a polished next-match rail.
4. Age-group navigator for 2015/2016/2017/2019.
5. Large poster-led user-controlled film experience.
6. Raštane Cup story with correct poster and supporting editorial mosaic.
7. Actual uncropped Poliklinika Ribnjak sponsor artwork and sponsor copy.
8. DSR Trnovčica notice with the correct evening football image.
9. Cinematic gallery preview.
10. Contact-rich photographic stadium footer.

## Motion and interaction

- 160–240ms ease-out transitions.
- One-time scroll reveals, subtle image zoom, active navigation, and tactile hover/focus feedback.
- Keep the existing ticker; no other continuous decorative motion, scroll hijacking, parallax dependency, or autoplay.
- Fully honor `prefers-reduced-motion`; essential content never depends on animation.

## Video rules

- No autoplay and no forced audio.
- Poster is the initial experience; `preload="none"`; request media only when the visitor activates play.
- Use `playsInline`; controls appear after playback begins.
- Maintain portrait framing without stretching on desktop or mobile; provide an accessible play control and fallback text.

## Accessibility and responsive rules

- WCAG 2.2 AA contrast, semantic landmarks/tables, skip link, keyboard-operated navigation and lightbox, and visible focus indicators.
- At least 44px touch targets. Never indicate status or rank by color alone.
- Never hide hero photography or essential intro copy on narrow screens.
- Test compositions at 390×844, 768×1024, 1280×720, and 1440×900 with no horizontal overflow.

## Fidelity constraint

Use ONLY the fonts, color tokens, spacing principles, component shapes, motion rules, routes, and real assets defined here. Preserve all functional content and competition hierarchy. Do not introduce new fonts, new colors, glassmorphism, neon esports styling, stock-logo substitutes, or autoplay media.
