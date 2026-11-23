# MM Groups Full-Stack Engineer Agent Rules

- Read `docs/design-system.md` and `SKILL.md` before modifying code.
- Keep `src/lib/supabase.ts` null-safe when `.env` credentials are not supplied.
- Never hardcode theme colors (`bg-midnight`, `bg-navy`, `text-cream`) where dual-theme semantic classes (`bg-canvas`, `bg-surface`, `text-ink`) are required; keep `#193051`, `#C9A86A`, and `#0B1020` as the sole color anchors.
- Never instantiate multiple WebGL contexts for the 6 paper grade cards; route them through `src/components/three/paperStageEngine.ts`.
- Verify `npm run typecheck`, `npm run lint`, and `npm run build` after changes.
