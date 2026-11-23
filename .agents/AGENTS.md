# MM Groups AI Coding Agent Instructions

Read `.agents/skills/mm-groups-full-stack-engineer/SKILL.md` and the specialist skills under `.agents/skills/` before making changes. Follow `docs/design-system.md` as the visual contract and inspect actual source files before claiming behavior.

## Project Identity

- **Brand**: MM Groups — Paper Industry (`MM Groups` / `مجموعة إم إم`).
- **Core Product**: Bilingual English/Arabic (`EN` / `AR`, `/en` & `/ar`, `LTR` / `RTL`) dark & light marketing and quote-request platform for industrial paper manufacturing and bulk supply across 6 grades: Kraft, White Offset, Coated, Newsprint, Cardboard, and Tissue.
- **Stack**: Next.js 16 (`16.4.6`) App Router, React 19, TypeScript (strict), Tailwind CSS 3.4, Three.js, Framer Motion, Lenis, Lucide React icons, Supabase (`quote_requests` table).

## Brand & Theme Rules (Hard Invariants)

- **3 Main Anchor Colors**: `#193051` (Brand Navy), `#C9A86A` (Brand Gold), `#0B1020` (Brand Midnight).
- Use semantic RGB theme tokens (`canvas`, `canvasAlt`, `surface`, `surfaceHover`, `contrastBand`, `contrastInk`, `ink`, `inkMuted`, `inkSubtle`, `accent`, `accentStrong`, `accentInk`, `line`) so both **dark** (`[data-theme="dark"]`) and **light** (`[data-theme="light"]`) themes remain WCAG AA compliant.
- **Typography**: `Sora` + `Inter` for English; `Cairo` for Arabic. Never apply wide `letter-spacing` to Arabic glyphs (use `.tracking-brand`).
- **Official Artwork**: Keep `public/mm-logo-dark.svg`, `public/mm-logo-light.svg`, `public/mm-3d-logo/*`, and the 8-strip `MM` geometry unchanged. Never fabricate certifications, offices, or external connections.

## Specialist Skills

- `mm-groups-full-stack-engineer`: Architecture, Next.js 16/React/TS, Supabase quote persistence, security & verification.
- `mm-groups-seo-engineer`: Next.js Metadata API (`generateMetadata`), reciprocal `/en` & `/ar` `hreflang`, `robots.ts`, `sitemap.ts`, `manifest.ts`, JSON-LD (`Organization`, `OfferCatalog`), semantic crawlable HTML, Core Web Vitals.
- `mm-groups-ui-ux-designer`: Dual Dark/Light design system, WCAG contrast, RTL/LTR layout, bilingual copy & state UI.
- `mm-groups-ci-cd`: Dependency integrity, `typecheck` (`next typegen && tsc --noEmit`) / `lint` / `build` (`next build`) gates, environment safety, `next start` smoke tests.
- `mm-groups-motion-3d`: Single-context 3D paper engine (`paperStageEngine.ts`), `Hero3D` 8-strip logo, preloader, directional translation curtain, reduced-motion handling.
- `mm-groups-phone-responsive`: `320px–430px` phone & tablet ergonomics, `100dvh`, `44×44px` touch targets, `16px` mobile inputs, touch 3D tap interactions, RTL mobile drawers.
