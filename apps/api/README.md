# Portfolio API

NestJS API for portfolio data, contact messages, resume entries, and protected
content-management routes. It uses PostgreSQL through TypeORM and shares
cross-application types from `packages/shared`.

## Local development

Run commands from the monorepo root. Copy `.env.example` to `.env` and configure
the database and Supabase values before using database-backed routes.

```sh
pnpm dev:api
```

The default local port is `3001`; the health endpoint is
`http://localhost:3001/api/health`.

## Environment variables

| Variable                   | Purpose                                                                   |
| -------------------------- | ------------------------------------------------------------------------- |
| `PORT`                     | Listen port; defaults to `3001` locally. Render supplies this at runtime. |
| `WEB_ORIGIN`               | Website origin allowed by CORS, for example `http://localhost:3000`       |
| `DATABASE_URL`             | Supabase PostgreSQL connection string                                     |
| `DATABASE_SSL`             | Set to `true` for Supabase PostgreSQL                                     |
| `SUPABASE_URL`             | Supabase project URL used to verify admin sessions                        |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase publishable/anonymous key used for session verification          |
| `ADMIN_EMAIL`              | Email address allowed to use protected API routes                         |
| `LEETCODE_USERNAME`        | Public LeetCode username used by the stats endpoint                       |

Keep credentials in `.env` locally or in the hosting provider's environment
settings. Never add real secrets to `.env.example` or commit them.

## Database migrations

Schema changes belong in `src/database/migrations`; TypeORM synchronization is
disabled. After configuring `DATABASE_URL`, run migrations from the repository
root:

```sh
pnpm --filter @dinglevarshney/api migration:show
pnpm --filter @dinglevarshney/api migration:run
```

To roll back the most recent migration:

```sh
pnpm --filter @dinglevarshney/api migration:revert
```

## Deploy to Render

Create a Node web service connected to this repository. Leave **Root
Directory** blank so Render can access the root pnpm workspace and
`packages/shared`. Select Node.js 22 or newer.

- Build command: `pnpm install --frozen-lockfile && pnpm --filter @dinglevarshney/api build`
- Start command: `pnpm --filter @dinglevarshney/api start`
- Health check path: `/api/health`

Set `WEB_ORIGIN` to the deployed Vercel website origin and configure the
database/Supabase environment variables in Render. Do not set `PORT` manually;
the API reads the port supplied by Render.

## Route groups

- Public read endpoints: projects, certificates, skills, profile, about
  chapters, and mascot dialogues
- Public write endpoint: contact messages
- Protected `/api/admin/*` endpoints: portfolio content, inbox, and resume
  management
- `GET /api/health`: service health

Protected API routes validate the Supabase access token and allow only the
configured `ADMIN_EMAIL`.
