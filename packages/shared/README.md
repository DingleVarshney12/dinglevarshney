# Shared Types

This private pnpm workspace package contains the small set of TypeScript
contracts used by both `apps/web` and `apps/api`, including social links,
resume-entry categories, and contact-message status.

Web-only portfolio data types live in `apps/web/src/lib/types`. Keep a type in
this package when both the frontend and API need to agree on its shape.

The package is consumed through the `workspace:*` dependency; it is not a
separately deployed application.
