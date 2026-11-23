# Component UX Standards

- **`BrandLogo`**: Exact 8-strip SVG geometry (`viewBox="-20 -20 760 440"`), transparent backdrop, automatic dark/light/inverse ink adaptation.
- **`ThemeToggle`**: `44×44px` circular control with animated Sun/Moon swap, localized tooltip & `aria-label`.
- **`LanguageToggle`**: Segmented `EN` / `عربي` pill with Framer Motion shared `layoutId` active capsule and >= `44px` hit height.
- **`PaperTypes` & `PaperModal`**: 6 interactive 3D paper grade cards (`kraft`, `offset`, `coated`, `newsprint`, `cardboard`, `tissue`), filter tabs (`All`, `Packaging`, `Print`, `Specialty`), modal 3D preview + direct `"Request a Quote"` handoff to `ContactForm`.
- **`About`**: High-contrast editorial section inverting background/foreground across dark and light modes.
- **`ContactForm` & `Footer`**: 100% localized English & Arabic strings, clear validation error linking (`aria-describedby`), resilient Supabase status feedback, and `44×44px` quick action links.
