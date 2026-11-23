# Three.js Paper Cards & Hero Logo Reference

## The 6 Paper Grade Geometries (`paperStageEngine.ts`)

| ID | Sheets | Physical Character | Interaction |
|---|---|---|---|
| `kraft` | 10 | Fibrous brown pine grain + bump map + curl `0.12` | Fan & spread on hover/tap |
| `offset` | 12 | Crisp cream uncoated grain + bump map + curl `0.06` | Fan & spread on hover/tap |
| `coated` | 8 | CMYK gradient crest + clearcoat `1.0` + roughness `0.12` | Glossy specular fan |
| `newsprint` | 10 | Procedural masthead & multi-column newsprint + plain news back sheets (`mapKind === 'news'`) | Press stack fan |
| `cardboard` | 3 layers | Extruded sinusoidal corrugated flute + bottom liner + peeling top liner | Corner peel in-place vertex update |
| `tissue` | 5 | Translucent undulating sinusoidal crepe layers with `sheen: 1` | Weightless wave separation |

## Single-Context Blit Pipeline

1. One offscreen `WebGLRenderer` (`antialias: true`, `alpha: true`, `dpr <= 2`).
2. One `PMREMGenerator` environment scene (`envScene()`) shared across all slots.
3. Each `<PaperStack3D>` owns a lightweight 2D `<canvas>` + isolated `THREE.Scene` + directional & rim lights tuned to `dark` or `light` theme.
4. `PaperStageEngine` resizes the offscreen GL canvas to the slot's pixel dimensions (`w * dpr × h * dpr`), renders `slot.scene`, and blits with `ctx2d.drawImage(...)`.

## Hero3D Theme Palette

- **Dark**: `M1 = 0xC9A86A`, `M2 = 0x4E74A8`, sheets `0xF4EFE3` & `0xC9A86A`, `envIntensity = 0.65`.
- **Light**: `M1 = 0x193051`, `M2 = 0xC9A86A`, sheets `0x193051` & `0xC9A86A`, `envIntensity = 0.95`.
