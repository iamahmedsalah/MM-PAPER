# Viewport Matrix & Touch Standards

## Target Viewport Matrix

- **Phones**: `320×568`, `360×800`, `390×844`, `430×932`
- **Tablets**: `768×1024`, `834×1194`, `1024×768` (landscape)
- **Desktops**: `1280×800`, `1440×900`

## Fluid Type & Containers

- Hero display heading: `text-[clamp(2.15rem,6.5vw,4rem)]` with `leading-[112%]` (EN) and natural Arabic line-height (`leading-[125%]` in `ar` if needed).
- `Hero` container uses `min-h-[100dvh]` so mobile URL bars do not clip hero CTAs or `StatsStrip`.
- Safe-area helpers: `pb-[calc(1.5rem+env(safe-area-inset-bottom))]` on mobile drawer and bottom toast notifications.
- Minimum interactive target size: `44×44px` (`min-h-[44px] min-w-[44px]`).
