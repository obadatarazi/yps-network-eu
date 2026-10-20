# YPS Network EU

Website for the **EU Youth, Peace and Security (YPS) Network** — Asia & Middle East region presence. Members, programmes, and join flows in a modern TypeScript stack.

Maintained by [Obada Al Tarazi](https://github.com/obadatarazi) (Active Member & Web Developer).

---

## Stack

| Area | Tech |
| --- | --- |
| UI | React 19, TanStack Router / Query / Table, Tailwind CSS v4 |
| App | Vite 8, TypeScript, Zod, React Hook Form |
| Auth / data | better-auth, Kysely, PostgreSQL (or PGlite for local) |
| 3D | Three.js |
| Deploy | Vercel / Netlify / Hostinger (`build:hostinger`) |

## Scripts

```bash
npm install
npm run dev          # Vite on :8080
npm run typecheck
npm run lint
npm test
npm run build        # frontend build + DB migrate
npm run build:frontend
```

## Project layout

```text
src/           App routes, UI, auth, data helpers
server/        Server / Nitro side
migrations/    DB migrations
scripts/       Build, migrate, pack, checks
public/        Static assets
netlify/       Netlify functions (e.g. join)
```

## Deploy notes

- Prefer **Vercel** (`vercel.json` + Nitro preset). `npm run build:frontend` must succeed with production deps available.
- **Netlify** frontend-only config is in `netlify.toml`.
- Hostinger pack: `npm run build:hostinger` then the pack scripts under `scripts/`.

## Security

Do not commit `.env` files or auth secrets. Use platform env vars for production.

## License

Private project for the YPS Network. Contact maintainers before reuse.
