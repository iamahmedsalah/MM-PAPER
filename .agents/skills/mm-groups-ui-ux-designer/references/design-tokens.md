# Design Tokens Reference

## Tailwind Semantic Mapping (`tailwind.config.js` & `src/index.css`)

- `bg-canvas` -> `--color-bg`: Dark `#0B1020`, Light `#F7F4EC`
- `bg-canvasAlt` -> `--color-bg-alt`: Dark `#101A30`, Light `#EEE9DD`
- `bg-surface` -> `--color-surface`: Dark `#193051`, Light `#FFFDF8`
- `bg-contrastBand` / `text-contrastInk` -> Dark `#F4EFE3`/`#193051`, Light `#193051`/`#F4EFE3`
- `text-ink` -> `--color-ink`: Dark `#F4EFE3`, Light `#0B1020`
- `text-inkMuted` -> `--color-ink-muted`: Dark `#C2CADA`, Light `#193051`
- `text-inkSubtle` -> `--color-ink-subtle`: Dark `#94A0B8`, Light `#425472`
- `text-accent` -> `--color-accent`: Dark `#C9A86A`, Light `#9A7634`
- `border-line/20` -> `--color-border`: Dark `201 168 106`, Light `25 48 81`

## Theme-Aware Controls

- Primary buttons always stay authoritative `#C9A86A` Gold fill with `#0B1020` Midnight text (`bg-gold text-midnight`) for clear visual hierarchy and > 7.5:1 contrast in both themes.
- 3D Paper Card stages use `linear-gradient(160deg, var(--thumb-grad-a), var(--thumb-grad-b))` so kraft, offset, coated, newsprint, cardboard, and tissue edges remain legible in dark and light themes.
