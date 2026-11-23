---
name: mm-groups-phone-responsive
description: >-
  Phone-first and tablet responsive design engineering skill for MM Groups Paper
  Industry. Use for 320px–430px phone layouts, 768px–1024px tablets, 100dvh viewports,
  safe-area insets, >=44px touch ergonomics, iOS 16px input zoom prevention, touch-friendly
  3D card interactions, and RTL/LTR mobile drawer QA.
---

# MM Groups — Phone & Tablet Responsive Engineer

Make every section of **MM Groups — Paper Industry** effortless to read, tap, inspect in 3D, and submit a quote on real smartphones (`320px`–`430px`) and tablets (`768px`–`1024px`) in both English and Arabic, Dark and Light.

## Non-Negotiable Mobile Contracts

1. **Zero Horizontal Overflow**: Use `overflow-x: clip` on `html, body` (preserving sticky behavior) and responsive `min-w-0` grid/flex items across `320px` to `1440px`.
2. **Dynamic Viewport & Safe Areas**: Use `min-h-[100dvh]` / `h-[100dvh]` and `env(safe-area-inset-*)` padding for `Hero`, `Preloader`, `Navbar` mobile drawer, and `ContactForm` toast so iOS/Android bars and notches never overlap controls.
3. **Touch Ergonomics (`>= 44×44px`)**: `ThemeToggle`, `LanguageToggle` buttons, mobile drawer toggle, filter tabs, `PaperCard` 3D preview toggle, modal close button, and footer social links must all meet `44×44px` minimum hit areas.
4. **Pointer-Gated Hover Effects**: Wrap mouse card 3D perspective tilt and cursor radial glow checks in `(hover: hover) and (pointer: fine)` so touch devices never get stuck in tilted states after tapping.
5. **Touch 3D Paper Interaction**: On touch screens where hover isn't persistent, each paper card supports tapping the 3D stage or its `3D` button to toggle `active` fan/peel inspection cleanly.
6. **iOS Input Zoom Prevention**: Form inputs, selects, and textareas use `text-base sm:text-sm` (`16px` on phones) and `min-h-[46px]`.
7. **Mobile Navigation Drawer**: Slide-in RTL-aware drawer (`start`/`end` logical directions), Escape + backdrop dismissal, body scroll lock, compact `ThemeToggle` + `LanguageToggle` controls, and direct quote CTA.

## References

- `references/viewport-matrix-and-touch.md` — viewport widths, typography clamping, safe-area and `100dvh` rules.
- `references/mobile-navigation-and-forms.md` — mobile drawer, filter chip horizontal scroll, 3D tap interaction, and form input sizing.
- `references/rtl-mobile-qa.md` — Arabic phone QA across `320px`, `360px`, `390px`, `430px`, and tablets.
