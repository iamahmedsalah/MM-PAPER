# MM Groups Motion & 3D Agent Rules

- Never instantiate one `THREE.WebGLRenderer` per paper card; always use `paperStageEngine.ts`.
- Never reallocate `PlaneGeometry` inside an animation loop; update `position` attribute Z values and normals in-place.
- Always pause 3D loops when elements leave the viewport or `document.hidden` becomes true.
- Always bypass fullscreen preloader/transition curtains under `prefers-reduced-motion: reduce` while still rendering settled static 3D frames for paper stacks.
