---
version: "ui2web-website-clone"
name: "TINA ŠPORT"
description: "High-contrast sports-league interface built on a black–white–navy triad with aggressive accent red. Display type is generous Montserrat; body copy runs tight Arial. Sections stack vertically in full-bleed bands. Spacing is restrained; accents (red, gold text) land sparingly on CTAs and highlighted content to pull focus against dark backgrounds."
colors:
  primary: "#FFFFFF"
  secondary: "#183885"
  accent: "#EA2C59"
  background: "#000000"
  surface: "#222222"
  text-primary: "#FFFFFF"
  text-secondary: "#FFFFFF"
  border: "#222222"
typography:
  display-lg:
    fontFamily: "Montserrat"
    fontSize: "56px"
    fontWeight: 500
    lineHeight: "1"
  headline-md:
    fontFamily: "Arial"
    fontSize: "50px"
    fontWeight: 700
    lineHeight: "1"
    letterSpacing: "5px"
  body-md:
    fontFamily: "Arial"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: "0.79"
spacing:
  base: "15px"
  gap: "27px"
  card-padding: "27px"
  section-padding: "36px"
rounded:
  control: "3px"
  card: "3px"
  pill: "3px"
components:
  card: { background: "#222222", radius: "3px" }
  button: { background: "#EA2C59", radius: "3px" }
---
# TINA ŠPORT

Source: https://mnk-tinasport.hr/

## Overview

A sports-league site using bold monochromatic contrast: deep black full-bleed bands punctuated by white and navy surfaces. Red accent (#EA2C59) fires sparingly on primary CTAs and callout elements. Type hierarchy relies on Montserrat's weight (display) layered over Arial's bold body and tight leading, creating visual drama through scale and spacing tension rather than color variation. The palette is ruthlessly restrained—three tones dominate; photography and promotional imagery carry the visual warmth.

## Composition

Hero section spans full width: large title and subtitle set in white over a tilted ball-in-net photograph, no overlay. Followed by a stacked sequence of full-bleed horizontal bands: a narrow black label band, a navy sponsor surface, a black information band with embedded promotional card (warm photography, gold accent text), a grid of six venue/facility thumbnails on black, and a dark footer section with embedded match-day imagery.

The deliberate choice: each content band occupies full width and sits flush to its neighbors—no gutters, no breathing room—rather than a card-grid layout or centered container. This creates visual weight and sports-broadcast severity. The one exception is the promotional card within the lower-middle band, which sits inset with breathing room to signal it as the primary conversion point.

## Colors

**#000000 (50.1% area)** — dominant background across bands, nav, footer. Creates the void against which lighter content reads as urgent.

**#FFFFFF (3.1% area)** — primary text, headlines, and the nav logo. Concentrated in hero title and secondary surface text; absence elsewhere makes every white word feel declarative.

**#222222 (36.9% area)** — mid-tone surface for sponsor/partner bands and card backgrounds. Sits between black and white to break monotony without introducing new hue.

**#183885 (navy, secondary)** — sponsor/partner band background. One band of navy breaks the black–white duality and reads as institutional/credible.

**#EA2C59 (accent red)** — reserved for the primary promotional card's CTA button and small accent callouts (e.g., highlighted date ranges or fee amounts in gold/yellow). Rationed to ~2–3 moments per page ensures it stops the eye.

The restraint trade-off: no accent on buttons in the nav or footer, no colored borders, no tinted overlays on photography. Every red moment must earn its place by signaling a critical action or deadline.

## Typography

**Montserrat 56px / 500 weight** — hero and major section headings. Display weight creates immediate visual hierarchy and reads as bold without aggression.

**Arial 50px / 700 (headline-md)** — mid-level section titles. Heavy weight and 5px letter-spacing add formality and sports-authority tone.

**Arial 30px / 700 (body-md)** — event details, date ranges, prices, and secondary copy. Tight 0.79 line-height and bold weight compress information density, forcing scanning rather than leisurely reading. Appropriate for time-sensitive event listings.

No serif or script typefaces. Montserrat + Arial pairing is utilitarian and direct—no personality, pure legibility at scale.

## Layout

Vertical stack dominates. Each full-width band occupies its own section with no max-width constraint—content stretches edge-to-edge. Internal padding (27px card-padding, 36px section-padding) keeps text and elements off the viewport edges.

The promotional card (event details with thumbnail) sits centered and inset within a black band, creating a visual break and forcing focus. It uses a 3-column grid for venue images below: uniform squares, flush arrangement, no gap.

No horizontal scrolling. Typography and card heights scale minimally across breakpoints; layout remains vertical stack.

## Components

**Card** (venue thumbnails, sponsor bands): 
- background: #222222 (mid-tone) or inherit from band (navy / black)
- radius: 3px (barely perceptible; almost hard-edged)
- padding: 27px
- no shadow or blur

**Button** (primary CTA on promotional card):
- background: #EA2C59 (red accent)
- radius: 3px
- padding: 15px 27px (tight, sports-ticketing proportions)
- text: white, Arial bold
- no icon; text-only

**Input/form** (if present): inherit black background, white text, 3px radius, minimal border (#222222).

## Motion

Transitions are conservative and brief:
- **margin-top**: 0.4s ease-in-out (for staggered section reveals or scroll-triggered slides)
- **background-color, color, transform, opacity**: 0.4s ease-in-out (on hover/focus for buttons and interactive elements)
- **display**: 0.3s (for mobile nav expand/collapse)

No elastic easing, no bounce. All motion is linear-to-ease, reinforcing the institutional tone.

## Effects

Promotional card includes a large photo beneath the event details (a field, crowd, or facility). The photo is unmanipulated—no darkening overlay, no blur. Black backgrounds on adjacent bands provide frame contrast. Footer section includes a full-bleed night-match photo; again, no filter or grading.

No gradients, no atmospheric blur, no glass-morphism. Canvas is flat color or direct image.

## Guardrails

1. **Never add color beyond the six roles**. No new accent shades, no gradient backgrounds, no category-label pills with custom hues. If a new element needs color, use one of the six or note it as an observed approximation (e.g., "observed gold text on promotional callouts").

2. **Preserve the band-stacking vertical rhythm**. Do not reflow sections into a grid or multi-column layout. Each band occupies full width; internal elements may flex, but bands do not sit side-by-side.

3. **Keep type weights strict**: Montserrat is display-only (56px+); Arial is body and mid-heading. Do not mix weights within a role (e.g., no Arial 400 for body copy; stay at 700).

4. **Red accent is rationed to ~2–3 moments per page**. Primary button, one highlighted date or fee, one callout. If you find yourself coloring more than three elements red, you've broken the restraint.

5. **Radius is 3px (nearly hard-edged) across all components**. Do not round to 8px, 12px, or 16px. This flat, minimal radius is core to the industrial sports-site identity.