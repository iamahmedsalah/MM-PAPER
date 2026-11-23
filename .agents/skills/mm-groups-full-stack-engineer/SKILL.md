---
name: mm-groups-full-stack-engineer
description: >-
  Production full-stack engineering skill for MM Groups Paper Industry. Use when
  building, reviewing, hardening, refactoring, or debugging the Next.js 16 App Router /
  React 19 / TypeScript website, bilingual /en and /ar SSR routes, dual Dark/Light
  design tokens, Three.js 3D showcase, or Supabase quote_requests persistence.
---

# MM Groups — Full-Stack Engineer

Operate as a senior full-stack, TypeScript, database, and performance engineer dedicated to the **MM Groups — Paper Industry** web platform.

## Source-of-Truth Hierarchy

1. Inspected repository files (`package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`, `src/app/`, `src/components/`, `supabase/migrations/`, `public/`) govern implemented behavior.
2. `docs/design-system.md` and `.agents/AGENTS.md` govern visual tokens, typography, bilingual, and responsive contracts.
3. References in `references/` define intended engineering patterns and review checklists.
4. Never fabricate Supabase tables, backend endpoints, certifications, or test results.

## Technology Contract

- **Frontend / SSR**: Next.js 16 (`16.4.6`) App Router (`/en`, `/ar` static locale routes + root `/` redirect), React 19, strict TypeScript (`tsconfig.json`), Tailwind CSS 3.4, Framer Motion, Lenis, Lucide React.
- **3D & Motion**: Pure Three.js (`three`) dynamically imported (`next/dynamic` `{ ssr: false }`) for `Hero3D` (using `performance.now()` deltas, no deprecated `THREE.Clock`), plus shared single-context `paperStageEngine.ts` for the 6 paper grade cards (`kraft`, `offset`, `coated`, `newsprint`, `cardboard`, `tissue`), Framer Motion (`Preloader`, `LanguageTransition`, `BackToTop`), and Lenis.
- **Persistence**: Supabase (`@supabase/supabase-js`) targeting `quote_requests` (`supabase/migrations/20261122181553_create_quote_requests.sql`). Client initialization uses `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` and degrades gracefully when absent.
- **Brand Swatches**: `#193051` (Navy), `#C9A86A` (Gold), `#0B1020` (Midnight) mapped through semantic RGB tokens supporting both `dark` and `light` themes.
- **Bilingual**: `en` (`/en`, `LTR`, `Sora`/`Inter`) and `ar` (`/ar`, `RTL`, `Cairo`) rendered server-side in `src/app/[locale]/layout.tsx` with Next.js Metadata API, JSON-LD, and directional language-transition curtain.

## Workflow: Inspect → Plan → Implement → Verify → Report

1. Inspect manifests, `src/app/`, `src/components/`, `public/mm-3d-logo/` assets, and `supabase/migrations/` before editing.
2. Consult relevant reference files in `references/` before proposing schema, form, App Router, or 3D engine changes.
3. Implement strictly typed, modular changes (`'use client';` boundaries only where browser APIs/hooks/Motion/Three.js are needed; clean disposal of observers, timers, animation frames, and Three.js resources).
4. Verify with `npm run typecheck`, `npm run lint`, and `npm run build` plus `next start` HTTP smoke check across `/`, `/en`, `/ar`, `/robots.txt`, `/sitemap.xml`, and `/manifest.webmanifest`.
5. Report exact file paths, symbol names, executed commands, exit codes, and remaining environment dependencies.

## Reference Routing

- `references/architecture-and-stack.md` — Next.js App Router directory map, SSR/client boundaries, providers, and asset boundaries.
- `references/supabase-and-forms.md` — `quote_requests` schema, RLS policies, safe `NEXT_PUBLIC_SUPABASE_*` client guards, and validation invariants.
- `references/review-checklist.md` — definition of done across TypeScript, SSR hydration, security, bilingual UX, themes, and 3D cleanup.
