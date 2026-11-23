---
name: mm-groups-motion-3d
description: >-
  3D WebGL and motion choreography skill for MM Groups Paper Industry. Use for
  Hero3D 8-strip paper logo rendering, the 6 interactive 3D paper grade cards
  (paperStageEngine.ts / PaperStack3D), the branded Preloader, directional
  LanguageTransition curtain, Framer Motion reveals, and GPU/WebGL budget tuning.
---

# MM Groups — Motion & 3D Typography / Paper Engineer

Craft tactile, GPU-efficient 3D paper geometry and choreographed motion anchored around the MM Groups identity (`#193051`, `#C9A86A`, `#0B1020`).

## Core Architecture

1. **Hero 3D Monogram (`Hero3D.tsx`, `logoGeometry.ts`)**:
   - Loaded strictly client-side in `Hero.tsx` via `next/dynamic(() => import('./three/Hero3D'), { ssr: false })` so WebGL never executes during SSR.
   - Renders directly with pure `THREE.WebGLRenderer` + `performance.now()` frame deltas (never `@react-three/fiber` or deprecated `THREE.Clock`), assembling the 8 extruded beveled paper strips of the `MM` monogram plus 18 floating sheets.
   - Adapts camera framing dynamically to viewport aspect (`aspect < 0.9` portrait phones pull back and lift slightly so the monogram sits cleanly above text/CTAs) and updates materials live to `theme` (`dark`: Gold `#C9A86A` + Luminous Navy `#4E74A8`; `light`: Brand Navy `#193051` + Gold `#C9A86A`) without rebuilding geometry.
   - Imports `RoomEnvironment` directly from `three/examples/jsm/environments/RoomEnvironment.js`.
   - Pauses animation when offscreen or `document.hidden === true`; falls back cleanly to compact `<BrandLogo />` on reduced motion or `<= 2` core CPUs.
2. **6 Interactive 3D Paper Cards (`paperStageEngine.ts`, `PaperStack3D.tsx`)**:
   - **Single Shared WebGL Context**: One offscreen `THREE.WebGLRenderer` + shared `PMREMGenerator` environment + one visibility-aware RAF loop blitting onto lightweight 2D `<canvas>` elements across all 6 cards (`kraft`, `offset`, `coated`, `newsprint`, `cardboard`, `tissue`) and `PaperModal`. Never create 6 separate `WebGLRenderer` instances.
   - **Fix & Optimize Geometry**: Check `sp.mapKind === 'news'` for plain newsprint sheets; mutate cardboard peel Z-vertices in-place rather than re-allocating geometry per frame; dispose all textures/geometries/materials on unmount.
   - **Reduced Motion**: Render one settled static 3D frame instead of leaving a blank container.
   - **SVG Fallback**: If WebGL is unavailable, render a layered paper-swatch SVG stack.
3. **Branded Motion Choreography**:
   - **`Preloader`**: 8-strip monogram assembly (`MM_LOGO_PATHS`) + gold progress rule, upward sheet lift (`~950ms`, capped `<= 1200ms`), hydration-safe initial state, bypassed via `.mm-preloader` CSS + `useEffect` under `prefers-reduced-motion: reduce`.
   - **`LanguageTransition`**: Directional paper curtain sliding RTL for Arabic and LTR for English (`190ms` swap midpoint, `460ms` total), bypassed under reduced motion.
   - **Shared Curve**: Paper settle ease `[0.22, 1, 0.36, 1]`; animate only `transform` and `opacity`.

## References

- `references/threejs-paper-and-logo.md` — 6 paper specs, shared single-renderer blit architecture, and theme lighting rigs.
- `references/motion-choreography-and-preloader.md` — preloader, language transition curtain, Framer Motion reveals, and Lenis gating.
- `references/webgl-performance-budget.md` — context safety, memory disposal, visibility pausing, and reduced-motion contracts.
