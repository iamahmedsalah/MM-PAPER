---
name: mm-groups-ui-ux-designer
description: >-
  UI/UX and dual-theme design system skill for MM Groups Paper Industry. Use for
  Dark and Light theming built around #193051, #C9A86A, and #0B1020, bilingual
  EN/AR and RTL/LTR components, WCAG AA contrast, accessible dialogs/drawers, and
  conversion-focused industrial storytelling.
---

# MM Groups — UI/UX & Design System Engineer

Design and audit crisp, authoritative industrial paper interfaces in both **Dark** and **Light** themes and both **English (LTR)** and **Arabic (RTL)**.

## Brand & Design System Contract (`docs/design-system.md`)

- **3 Anchor Swatches**: Navy `#193051`, Gold `#C9A86A`, Midnight `#0B1020`.
- Use Tailwind semantic RGB tokens (`canvas`, `canvasAlt`, `surface`, `surfaceHover`, `contrastBand`, `contrastInk`, `ink`, `inkMuted`, `inkSubtle`, `accent`, `accentStrong`, `accentInk`, `line`) everywhere instead of hardcoded dark-only classes.
- Maintain WCAG AA contrast (>= 4.5:1 body text, >= 3:1 large text & UI borders) in **both** `[data-theme="dark"]` and `[data-theme="light"]`. Light mode uses `#9A7634` (`accent`) for readable gold labels on parchment (`#F7F4EC`) while keeping `#C9A86A` + `#0B1020` for primary filled CTAs.
- **Fonts**: `Sora` + `Inter` (English), `Cairo` (Arabic). Never apply wide `letter-spacing` to Arabic glyphs (`.tracking-brand` disables tracking under `html[lang="ar"]`).
- **Official Artwork**: Render the 8-strip `MM` monogram via `<BrandLogo />` (`variant="auto" | "inverse"`) rather than static green-tinted SVGs.

## Workflow: Inspect → Tokenize → Compose → Verify

1. Inspect `src/index.css`, `tailwind.config.js`, `src/theme/ThemeContext.tsx`, and target components across `dark`/`light` and `en`/`ar`.
2. Ensure interactive controls (`ThemeToggle`, `LanguageToggle`, filter chips, modal close, social links) meet `>= 44×44px` hit areas, keyboard focus visibility (`focus-visible:outline`), and clear `aria-label` / `aria-pressed` states.
3. Use Tailwind logical classes (`start-*`, `end-*`, `border-s`, `ms-*`, `me-*`) so RTL mirrors seamlessly without breaking phone/email/GSM `dir="ltr"` spans.
4. Ensure forms, modals, and buttons show clear loading, validation, error, and confirmation feedback.

## References

- `references/design-tokens.md` — Dark & Light RGB CSS custom properties and WCAG contrast pairings.
- `references/rtl-and-accessibility.md` — RTL mirroring, Arabic shaping, focus management, and ARIA patterns.
- `references/component-standards.md` — standards for `Navbar`, `ThemeToggle`, `LanguageToggle`, `PaperTypes`, `PaperModal`, `About`, `ContactForm`, and `Footer`.
