# Portfolio Website

Next.js App Router frontend for the classic portfolio and its optional 3D room.
Shared API contracts come from `packages/shared`.

## Local development

From the monorepo root, copy `.env.example` to `.env`, set the local API and
Supabase values, then start the workspace with `pnpm dev` or just the website
with `pnpm dev:web`.

The website runs at http://localhost:3000. The API runs at
http://localhost:3001/api when started from this workspace.

## Environment variables

| Variable                               | Purpose                                                           |
| -------------------------------------- | ----------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`                  | API base URL, including `/api`                                    |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase project URL for admin sign-in and uploads                |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable/anonymous key                                |
| `ADMIN_EMAIL`                          | Portfolio owner email allowed into the admin panel                |
| `NEXT_PUBLIC_SITE_URL`                 | Deployed HTTPS origin used for canonical metadata and the sitemap |

Do not commit `.env` files. `.env.example` contains placeholders only.

## Deploy to Vercel

Create a Vercel project from this repository and set its **Root Directory** to
`apps/web`. Enable **Include source files outside of the Root Directory** so
the install/build can access the pnpm workspace files and `packages/shared`.
Use the Next.js framework preset, Node.js 22 or newer, and its default build
command.

Set `NEXT_PUBLIC_API_URL` to the Render API origin ending in `/api`, set
`NEXT_PUBLIC_SITE_URL` to this site's production origin, and configure the
Supabase values and `ADMIN_EMAIL` in Vercel. Redeploy after changing these
values because `NEXT_PUBLIC_*` variables are embedded during the build.
