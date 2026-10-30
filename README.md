# Dingle Varshney Portfolio

A pnpm monorepo for a personal portfolio with a Next.js website, a NestJS API,
and TypeScript contracts shared by both applications.

## Workspace

| Path              | Purpose                                                           |
| ----------------- | ----------------------------------------------------------------- |
| `apps/web`        | Next.js portfolio, classic experience, and interactive 3D world   |
| `apps/api`        | NestJS API, PostgreSQL access, and portfolio management endpoints |
| `packages/shared` | Types used by both the website and API                            |

## Requirements

- Node.js 22 or newer (required by the repository's pnpm 11 version)
- Corepack enabled so the `packageManager` version in the root `package.json` is used
- Supabase project and PostgreSQL connection for database-backed features

## Local development

From the repository root:

```sh
corepack enable
pnpm install --frozen-lockfile
```

Copy `apps/web/.env.example` to `apps/web/.env` and
`apps/api/.env.example` to `apps/api/.env`. Fill in the Supabase and database
values locally; never commit `.env` files or credentials.

Start both applications:

```sh
pnpm dev
```

- Website: http://localhost:3000
- API health check: http://localhost:3001/api/health

Start one application with `pnpm dev:web` or `pnpm dev:api`. Apply database
migrations with `pnpm --filter @dinglevarshney/api migration:run` after the API
environment is configured.

## Checks

```sh
pnpm format
pnpm format:check
pnpm typecheck
pnpm lint
pnpm build
pnpm check
```

`pnpm format` applies the repository's Prettier style. `pnpm format:check`
checks formatting without changing files. `pnpm check` runs lint, type checking,
and production builds for the workspace.

## Deployment overview

Deploy `apps/web` to Vercel and `apps/api` to Render from the same repository.
The workspace root and `packages/shared` must remain available to both builds.
See [Web deployment](apps/web/README.md) and [API deployment](apps/api/README.md)
for the service settings and environment variable names.

Before deploying the website, set `NEXT_PUBLIC_SITE_URL` to its public HTTPS
origin. This is used for canonical metadata and the sitemap. Set the API's
`WEB_ORIGIN` to the deployed website origin so browser requests pass CORS.
