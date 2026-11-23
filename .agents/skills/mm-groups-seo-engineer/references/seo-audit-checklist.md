# SEO Audit Checklist

- [ ] Both `/en` (`lang="en" dir="ltr"`) and `/ar` (`lang="ar" dir="rtl"`) return `HTTP 200` with complete server-rendered Arabic/English content.
- [ ] Root `/` redirects cleanly to `/en`.
- [ ] Self-canonical and reciprocal `hreflang` (`en`, `ar`, `x-default`) appear in `<head>` of both `/en` and `/ar`.
- [ ] `/robots.txt`, `/sitemap.xml`, and `/manifest.webmanifest` return `HTTP 200` with valid syntax.
- [ ] Single `<h1>` exists per locale page (`Hero.tsx`); sections use `<h2>` and cards use `<h3>`.
- [ ] `buildJsonLd(locale)` parses cleanly with zero fabricated reviews, hours, or addresses.
- [ ] Open Graph & Twitter tags reflect `MM Groups` branding per locale.
