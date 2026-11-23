---
name: mm-groups-seo-engineer
description: >-
  Technical, bilingual, and local SEO engineering skill for MM Groups Paper Industry.
  Use for Next.js 16 App Router SSR/SSG (/en, /ar), Metadata API (generateMetadata,
  canonical, reciprocal hreflang), robots.ts, sitemap.ts, manifest.ts, JSON-LD
  structured data (Organization, WebSite, OfferCatalog), semantic crawlable HTML,
  Core Web Vitals protection, and non-blocking progressive 3D enhancement.
---

# MM Groups — SEO & Growth Engineer

Ensure **MM Groups — Paper Industry** ships statically pre-rendered, crawlable, fast, bilingual English (`/en`) and Arabic (`/ar`) Next.js 16 pages with complete server-side SEO metadata and zero WebGL blocking.

## Core SEO Rules

1. **Server-Rendered Bilingual Routes (`/en` & `/ar`)**: Both locales render full HTML server-side via `src/app/[locale]/layout.tsx` and `src/app/[locale]/page.tsx` (`generateStaticParams` + `redirect('/en')` at root `/`). Never canonicalize `/ar` to `/en`.
2. **Next.js Metadata API**: `generateMetadata` in `src/app/[locale]/layout.tsx` outputs locale-specific `<title>`, `<meta name="description">`, `metadataBase` (`NEXT_PUBLIC_SITE_URL`), self-canonical (`/${locale}`), reciprocal `alternates.languages` (`en`, `ar`, `x-default`), Open Graph (`ar_EG` / `en_US`), and Twitter cards.
3. **Structured Data Grounded in Facts**: `buildJsonLd(locale)` in `src/lib/seo.ts` outputs `Organization`, `WebSite`, and `OfferCatalog` listing the 6 real paper grades (`Kraft`, `White Offset`, `Coated`, `Newsprint`, `Cardboard`, `Tissue`) localized per route. Never fabricate certifications, fake ratings, or unverified offices.
4. **Crawl & Discovery Routes**: Maintain `src/app/robots.ts` (`/robots.txt`), `src/app/sitemap.ts` (`/sitemap.xml` with `en`/`ar`/`x-default` alternates), and `src/app/manifest.ts` (`/manifest.webmanifest`).
5. **Core Web Vitals & Progressive 3D**: Target p75 LCP <= 2.5s, INP <= 200ms, CLS <= 0.1. Dynamically import `Hero3D` with `next/dynamic(..., { ssr: false })`, lazy-load the OpenStreetMap iframe, and ensure `Preloader` never removes `<main>` DOM from SSR HTML.

## Workflow: Audit → Map → Implement → Validate

1. Inspect `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/lib/seo.ts`, and `src/i18n/translations.ts`.
2. Verify single `<h1>` per page in `Hero.tsx`, logical `<h2>` / `<h3>` hierarchy across sections, and descriptive `alt` / `aria-label` attributes.
3. Verify built output (`next build`) and inspect live SSR HTML on `/en`, `/ar`, `/robots.txt`, and `/sitemap.xml` via `next start`.

## References

- `references/bilingual-seo-map.md` — `/en` & `/ar` intent, title/description targets, and 6-grade keyword framing.
- `references/technical-seo-and-schema.md` — Next.js Metadata API, `robots.ts`, `sitemap.ts`, JSON-LD templates, and CWV controls.
- `references/seo-audit-checklist.md` — pre-release SSR HTML, hreflang, accessibility, and performance audit gates.
