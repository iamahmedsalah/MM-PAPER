# Technical SEO & Structured Data Reference

## Next.js 16 App Router Metadata (`src/app/[locale]/layout.tsx` & `src/lib/seo.ts`)

1. `metadataBase`: resolved from `NEXT_PUBLIC_SITE_URL` (`SITE_URL` in `src/lib/seo.ts`).
2. `alternates`: self-canonical (`/${locale}`) + `languages: { en: '/en', ar: '/ar', 'x-default': '/en' }`.
3. `src/app/robots.ts` & `src/app/sitemap.ts`: publish `/en` and `/ar` with reciprocal `alternates.languages` and sitemap reference.
4. `src/app/manifest.ts`: exposes PWA metadata (`/manifest.webmanifest`) with MM Groups branding and `#0B1020` Midnight colors.

## Structured Data (`buildJsonLd(locale)`)

Embeds localized JSON-LD `@graph` in `src/app/[locale]/page.tsx` with:
1. `Organization`: `name` ("MM Groups" / "مجموعة إم إم"), `alternateName`, `logo`, `description`, `contactPoint`.
2. `WebSite`: `url`, `name`, `inLanguage`.
3. `OfferCatalog`: `Offer` -> `Product` items for all 6 manufactured paper grades (`Kraft`, `White Offset`, `Coated`, `Newsprint`, `Cardboard`, `Tissue`) localized to `en` or `ar`.

## SSR & Progressive Enhancement Controls

- Preloader overlays visually on client load while full `<main>` semantic HTML is already present in the initial SSR response for crawlers.
- All 6 paper grade cards render full HTML title, GSM range, description, and category label regardless of WebGL support.
- Embedded OpenStreetMap iframe uses `loading="lazy"` and descriptive localized `title`; `Hero3D` loads via `next/dynamic(..., { ssr: false })`.
