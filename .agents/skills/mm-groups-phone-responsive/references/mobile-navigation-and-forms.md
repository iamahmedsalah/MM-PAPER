# Mobile Navigation, 3D Touch & Forms

## Mobile Drawer (`Navbar.tsx`)

- Compact header keeps logo, `<ThemeToggle />`, `<LanguageToggle compact />`, and `<button aria-expanded>` unobstructed even at `320px`.
- Slide-in drawer covers `h-[100dvh]`, locks body scrolling, traps Escape, closes on route anchor tap, and surfaces full-width `<GoldLink>` quote CTA plus theme/language pills.

## 3D Paper Card Touch Ergonomics (`PaperTypes.tsx`)

- Filter tabs (`All`, `Packaging`, `Print`, `Specialty`) sit in a `no-scrollbar overflow-x-auto` strip with `shrink-0 min-h-[44px]` pills so narrow `320px` screens never crush chips.
- Each 3D stage renders a subtle corner `3D` / tap toggle button (`44×44px` hit box) that fans sheets or peels cardboard on tap (`active` state), mirroring desktop hover.
- Card perspective tilt runs only when `window.matchMedia('(hover: hover) and (pointer: fine)').matches` is true.

## Forms (`ContactForm.tsx`)

- Use `text-base sm:text-sm min-h-[46px]` on all inputs, selects, and textareas to eliminate iOS auto-zoom.
- `Location.tsx` scales map iframe cleanly (`h-[280px] sm:h-[360px] md:h-[460px]`) without overflowing narrow containers.
