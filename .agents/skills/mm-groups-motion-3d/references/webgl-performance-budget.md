# WebGL Performance & Reduced-Motion Budget

- **Maximum WebGL Contexts**: 2 total (`Hero3D` R3F Canvas + 1 shared `PaperStageEngine` offscreen context) — safely under mobile Safari/Android 8-context caps.
- **Visibility Pausing**: Both `Hero3D` and `PaperStageEngine` listen to `IntersectionObserver` and `document.visibilitychange` (`frameloop = 'never'` / skip RAF render when hidden).
- **Clean Disposal**: Dispose geometries, materials, textures, and PMREM targets on unmount; cancel all `requestAnimationFrame` loops and disconnect observers.
- **Reduced Motion**:
  - `Preloader` and `LanguageTransition` immediately skip animations.
  - `Hero3D` renders static theme-aware `<BrandLogo />`.
  - `PaperStack3D` renders a static settled 3D paper stack frame without continuous idle floating.
