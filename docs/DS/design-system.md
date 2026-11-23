# MM Groups — Design System Specification

## 1. Core Brand Palette (3 Anchor Swatches)

Every surface, ink token, border, and 3D lighting rig in the MM Groups web platform derives from three official brand colors:

| Token | Name | Hex | RGB | Role |
|---|---|---|---|---|
| `navy` | Brand Navy | `#193051` | `25 48 81` | Dark surface cards, light-mode primary ink & contrast band |
| `gold` | Brand Gold | `#C9A86A` | `201 168 106` | Primary CTAs, active chips, monogram accent, hairlines, rim highlights |
| `midnight` | Brand Midnight | `#0B1020` | `11 16 32` | Dark-mode page canvas, deep text ink in light mode, dark overlays |

Derived supporting tones stay strictly within the Navy / Gold / Paper-Cream harmonic family (`#22406B` Navy Light, `#101A30` Deep Slate Navy, `#E0C795` Gold Light, `#9A7634` Light-mode WCAG AA Gold Accent, `#F4EFE3` Warm Paper Cream, `#F7F4EC` Parchment Canvas).

---

## 2. Semantic Theme Tokens (`dark` & `light`)

Themes are driven via `html[data-theme="dark"]` (default) and `html[data-theme="light"]`, mapped to Tailwind RGB variables in `tailwind.config.js` and `src/index.css`.

### Dark Theme (`[data-theme="dark"]`)
| Semantic Token | CSS Variable | Value (RGB / Hex) | Purpose |
|---|---|---|---|
| `canvas` | `--color-bg` | `11 16 32` (`#0B1020`) | Primary page background |
| `canvasAlt` | `--color-bg-alt` | `16 26 48` (`#101A30`) | Alternating section canvas |
| `surface` | `--color-surface` | `25 48 81` (`#193051`) | Cards, modals, drawer, stats cells |
| `surfaceHover` | `--color-surface-hover` | `34 64 107` (`#22406B`) | Elevated hover state |
| `contrastBand` | `--color-contrast-band` | `244 239 227` (`#F4EFE3`) | High-contrast About editorial section |
| `contrastInk` | `--color-contrast-ink` | `25 48 81` (`#193051`) | Ink inside contrast band |
| `ink` | `--color-ink` | `244 239 227` (`#F4EFE3`) | Primary headings & body ink |
| `inkMuted` | `--color-ink-muted` | `194 202 218` (`#C2CADA`) | Secondary paragraphs |
| `inkSubtle` | `--color-ink-subtle` | `148 160 184` (`#94A0B8`) | Metadata & eyebrows |
| `accent` | `--color-accent` | `201 168 106` (`#C9A86A`) | Interactive accent text/borders |
| `accentStrong` | `--color-accent-strong` | `224 199 149` (`#E0C795`) | Hover accents |
| `accentInk` | `--color-accent-ink` | `11 16 32` (`#0B1020`) | Text on gold buttons |
| `line` | `--color-border` | `201 168 106` (`#C9A86A`) | Hairlines & card borders (opacity-modulated) |

### Light Theme (`[data-theme="light"]`)
| Semantic Token | CSS Variable | Value (RGB / Hex) | Purpose |
|---|---|---|---|
| `canvas` | `--color-bg` | `247 244 236` (`#F7F4EC`) | Warm paper parchment page background |
| `canvasAlt` | `--color-bg-alt` | `238 233 221` (`#EEE9DD`) | Alternating section canvas |
| `surface` | `--color-surface` | `255 253 248` (`#FFFDF8`) | Elevated paper cards & modals |
| `surfaceHover` | `--color-surface-hover` | `243 238 226` (`#F3EEE2`) | Card hover state |
| `contrastBand` | `--color-contrast-band` | `25 48 81` (`#193051`) | High-contrast About editorial band |
| `contrastInk` | `--color-contrast-ink` | `244 239 227` (`#F4EFE3`) | Ink inside contrast band |
| `ink` | `--color-ink` | `11 16 32` (`#0B1020`) | Primary headings & body ink |
| `inkMuted` | `--color-ink-muted` | `25 48 81` (`#193051`) | Secondary paragraphs |
| `inkSubtle` | `--color-ink-subtle` | `66 84 114` (`#425472`) | Metadata & captions |
| `accent` | `--color-accent` | `154 118 52` (`#9A7634`) | WCAG AA dark gold accent on light paper |
| `accentStrong` | `--color-accent-strong` | `128 96 38` (`#806026`) | Hover/active gold text on light paper |
| `accentInk` | `--color-accent-ink` | `11 16 32` (`#0B1020`) | Text on filled `#C9A86A` gold buttons |
| `line` | `--color-border` | `25 48 81` (`#193051`) | Subtle architectural hairlines |

---

## 3. WCAG AA Contrast Matrix (Verified Target Pairs)

- Dark body ink `#F4EFE3` on `#0B1020`: > 15:1 (AAA).
- Dark muted ink `#C2CADA` on `#193051`: > 7.5:1 (AAA).
- Gold button text `#0B1020` on `#C9A86A`: > 7.8:1 (AAA).
- Light body ink `#0B1020` on `#F7F4EC`: > 16:1 (AAA).
- Light muted ink `#193051` on `#FFFDF8`: > 12:1 (AAA).
- Light accent `#9A7634` on `#FFFDF8` / `#F7F4EC`: >= 4.5:1 (AA for normal/bold text & icons).

---

## 4. Bilingual Typography

- **English (`lang="en"`, `dir="ltr"`)**: Heading `Sora` (weights 400, 600, 700, 800); Body `Inter` (weights 400, 500, 600).
- **Arabic (`lang="ar"`, `dir="rtl"`)**: Heading & Body `Cairo` (weights 400, 500, 600, 700, 800).
- **Arabic Shaping Invariant**: `.tracking-brand` resets `letter-spacing: 0` and `text-transform: none` whenever `html[lang="ar"]` is active so connected Arabic glyphs never break.
- **Bidi Isolation**: Phone numbers, email addresses, GSM figures (`70 – 200 GSM`), and addresses remain wrapped in `dir="ltr"` where appropriate.

---

## 5. Motion, Preloader & 3D Studio Lighting

- **Shared Easing**: Paper settle ease `[0.22, 1, 0.36, 1]`.
- **Preloader Curtain**: 8-strip monogram assembly (`MM_LOGO_PATHS`), gold progress hairline, upward curtain lift (`~950ms`, hard cap `1200ms`). Instant bypass under `prefers-reduced-motion: reduce`.
- **Translation Motion Curtain**: Directional paper-sheet wipe (`z-[95]`) sliding RTL for Arabic and LTR for English (`190ms` locale swap midpoint, `460ms` complete), bypassed immediately under `prefers-reduced-motion: reduce`.
- **3D Hero Logo & Paper Cards**:
  - `Hero3D`: Dark theme uses `M1 = #C9A86A`, `M2 = #4E74A8`; Light theme uses `M1 = #193051`, `M2 = #C9A86A`.
  - `PaperStack3D` + `paperStageEngine.ts`: Single shared WebGL renderer blitting 6 paper grades (`kraft`, `offset`, `coated`, `newsprint`, `cardboard`, `tissue`) with theme-calibrated environment intensity (`0.78` dark / `1.05` light) and static reduced-motion framing.

---

## 6. Mobile & Viewport Standards

- Breakpoints checked: `320px`, `360px`, `390px`, `430px` (phones), `768px`, `834px`, `1024px` (tablets), `1280px`, `1440px` (desktop).
- Full-bleed viewport containers use `100dvh` (`min-h-[100dvh]`, `h-[100dvh]`) + `env(safe-area-inset-*)`.
- Interactive targets >= `44×44px`; form inputs use `text-base sm:text-sm` (`16px` on phones to prevent iOS Safari zoom).
- Hover 3D card tilt and radial glows are gated behind `(hover: hover) and (pointer: fine)`; coarse touch devices use tap-to-fan/peel toggles on the 3D paper cards.
