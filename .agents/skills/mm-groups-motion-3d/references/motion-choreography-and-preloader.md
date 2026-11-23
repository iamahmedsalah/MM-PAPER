# Motion Choreography & Preloader Reference

## Timing Tokens

- Paper settle easing: `cubic-bezier(0.22, 1, 0.36, 1)` (`[0.22, 1, 0.36, 1]`).
- Preloader: 8-strip `MM_LOGO_PATHS` assembly (`0.45s`, `0.045s` stagger), gold progress rule, upward curtain exit (`~950ms` start exit, `<= 1200ms` total); SSR-safe initial render with `.mm-preloader` CSS reduced-motion bypass.
- Language Transition Curtain: slides from inline-end (`x: '100%'` for AR, `x: '-100%'` for EN), settles across screen while `router.push` navigates to `/ar` or `/en` at `200ms`, slides out cleanly by `500ms`.
- Reveals: `Reveal`, `LineReveal`, and `GoldRule` trigger `once: true` via IntersectionObserver; never hide `<main>` HTML from crawlers.
- Lenis smooth scrolling runs only when `(prefers-reduced-motion: no-preference)` AND `(pointer: fine)`.
