# Theme — Current Next.js Application

Source of truth: `src/app/globals.css`. The app uses vanilla CSS, not Tailwind.

## Current tokens

```css
:root {
  --navy: #07162f;
  --navy-2: #0d2144;
  --legacy-blue: #183885;
  --red: #da251e;
  --paper: #f4f1ea;
  --white: #ffffff;
  --ink: #101c30;
  --muted: #637086;
  --line: #d9dee8;
  --green: #2f7d50;
  --gold: #f4c95d;
  --display: "Barlow Condensed", "Arial Narrow", sans-serif;
  --body: Inter, Arial, sans-serif;
  --shell: min(100% - 48px, 1240px);
}
```

## Typography

- Display: local Barlow Condensed 700, used for large headings, teams, and score numerals.
- Body/UI: local Inter 400/600/700/800.
- Fluid H1: about 58–118px; H2: about 48–80px.
- Body line height: 1.7.

## Current visual language

- Dark navy cinema sections alternate with warm paper and pure-white editorial sections.
- Red is reserved for actions, current states, and strong rules.
- Large condensed type, sharp information blocks, quiet borders, and documentary football photography.
- Buttons and controls are generally squared or minimally rounded, with visible focus rings.
- Motion uses short ease-out transitions and one-time reveals; `prefers-reduced-motion` collapses animation and transition durations.

## Responsive structure

- Desktop navigation collapses below 1050px.
- Primary page-grid breakpoint is 760px.
- Narrow-phone refinements currently occur at 460px.
- Current defects to fix: homepage hero photography is hidden below 760px, intro copy is hidden below 460px, and the match ticket is not compact enough on small screens.

The approved redesign may refine spacing, gradients, shadows, radii, and scale only within the design-system rules in `.superdesign/design-system.md`.
