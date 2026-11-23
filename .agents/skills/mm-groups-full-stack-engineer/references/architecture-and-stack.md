# Architecture & Stack Reference

## Repository Structure

- `next.config.ts`: `transpilePackages: ['three']`, `poweredByHeader: false`, and HTTP security headers.
- `src/app/(redirect)/layout.tsx` & `src/app/(redirect)/page.tsx`: Isolated root redirect (`/` -> `/en`) preventing nested `<html>` hydration conflicts with localized root layouts.
- `src/app/[locale]/layout.tsx`: Server-rendered localized `<html lang={locale} dir={dir}>`, `generateStaticParams()` (`/en`, `/ar`), `generateMetadata()`, Google Fonts (`Cairo`, `Inter`, `Sora`), inline anti-FOUC theme script, `<ThemeProvider>`, and `<LanguageProvider initialLang={locale}>`.
- `src/app/[locale]/page.tsx`: Statically rendered bilingual landing page embedding localized JSON-LD (`buildJsonLd(locale)`) and rendering `<LandingPage />`.
- `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/manifest.ts`: Next.js Metadata API routes for crawl rules, bilingual sitemap alternates, and PWA manifest.
- `src/lib/seo.ts`: `SITE_URL`, `LOCALES`, `isLocale()`, and localized `Organization` + `WebSite` + `OfferCatalog` JSON-LD generator.
- `src/components/ui/`: `'use client'` modules (`Preloader.tsx`, `LanguageTransition.tsx`, `LanguageToggle.tsx`, `ThemeToggle.tsx`, `BrandLogo.tsx`, `logoPaths.ts`, `Buttons.tsx`, `Reveal.tsx`).
- `src/components/three/`: `Hero3D.tsx` (loaded via `next/dynamic(..., { ssr: false })`), `LogoMesh.tsx`, `FloatingSheets.tsx`, `logoGeometry.ts`, `paperStageEngine.ts`, `PaperStack3D.tsx`.
- `src/data/`: `papers.ts` (6 paper grades), `services.ts` (6 services), `managers.ts`, `site.ts` (stats & industrial use cases).
- `public/mm-3d-logo/`: Official brand SVGs (`mm-logo-dark.svg`, `mm-logo-light.svg`) and standalone 3D assets (`.glb`, `.obj`, `.ply`, `.stl`).

## SSR & Hydration Invariants

- Never access `window`, `document`, or `localStorage` during server render; initialize `ThemeProvider` safely and sync inside `useEffect`.
- Keep `'use client'` boundaries strictly on interactive components; keep `src/app/[locale]/layout.tsx` and `src/app/[locale]/page.tsx` Server Components for full HTML SEO rendering.

## Lifecycle & Cleanup Invariants

- All DOM event listeners, `ResizeObserver`, `IntersectionObserver`, timers, `requestAnimationFrame` loops, and Three.js textures/geometries/materials must clean up on unmount.
- Lenis smooth scrolling disables itself when `prefers-reduced-motion: reduce` is enabled or on coarse-pointer touch screens where native momentum scrolling is optimal.
