# RTL & Accessibility Reference

1. **Logical Layout**: Use `start-*`, `end-*`, `border-s`, `text-start`, `origin-left rtl:origin-right` instead of `left-*` or `right-*`.
2. **Directional Indicators**: In `ContactForm`, `Location`, `Counter`, and `PaperTypes`, wrap telephone numbers, emails, addresses (if English), and `GSM` specs in `dir="ltr"` so mixed bidi strings never reorder digits/hyphens incorrectly.
3. **Arabic Shaping**: Apply `.tracking-brand` instead of fixed `tracking-[0.25em]` on eyebrows, marquee items, and uppercase tags so `html[lang="ar"]` clears `letter-spacing` to `0`.
4. **Dialogs & Drawers**:
   - `PaperModal` supports `Escape` to close, backdrop click to close, `role="dialog"`, `aria-modal="true"`, and locks `document.body.style.overflow` while open.
   - `Navbar` mobile drawer locks background scroll, closes on `Escape` or link activation, and exposes `aria-expanded` / `aria-controls`.
5. **Focus Visibility**: Preserve `:focus-visible { outline: 2px solid rgba(201, 168, 106, 0.85); outline-offset: 2px; }` across all buttons, links, inputs, and theme/language toggles.
