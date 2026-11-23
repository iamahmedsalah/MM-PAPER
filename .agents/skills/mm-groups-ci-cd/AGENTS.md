# MM Groups CI/CD Agent Rules

- Never report `typecheck`, `lint`, or `build` as passing unless executed after the final edit with exit code 0.
- Never commit secrets or real `.env` files.
- Always check that `next build` and `next start` serve `/en`, `/ar`, `/robots.txt`, and `/sitemap.xml` cleanly without crashing on unconfigured Supabase env vars.
