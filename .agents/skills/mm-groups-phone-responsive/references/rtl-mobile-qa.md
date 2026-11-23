# RTL Mobile QA Checklist

- [ ] At `320px` in Arabic (`dir="rtl"`), `Navbar` brand, toggles, and menu button stay on a single row without wrapping or overflowing.
- [ ] `Hero` underline aligns from `start-0` (`right-0` in RTL) and CTAs stack cleanly on narrow phones.
- [ ] `Marquee` scrolls continuously in both LTR and RTL without blank gaps.
- [ ] All 6 `PaperCard` 3D canvases resize crisply on orientation changes and can be fanned/peeled via touch tap.
- [ ] `PaperModal` scrolls smoothly inside short mobile viewports (`max-h-[90dvh] overflow-y-auto`) with `44×44px` close control.
- [ ] `ContactForm` toast sits clear of iPhone home indicator (`bottom-[calc(1rem+env(safe-area-inset-bottom))]`).
