---
title: Operations
description: What CI verifies and how the static documentation site is produced.
---

The repository CI workflow verifies formatting, type safety, unit tests, security checks, code quality, the application production build, end-to-end tests, and the Blume documentation build.

## Documentation output

`pnpm docs:build` produces a static site in `dist/`. The directory is intentionally ignored because it is a build artifact, not source content. The published site is [cashlift-docs.vercel.app](https://cashlift-docs.vercel.app/).

CI validates the documentation build. Production publishing currently deploys the generated `dist/` output to the separate Vercel `cashlift-docs` project, so documentation changes require a manual production deploy until that publishing step is automated.

## Local preview

```bash
pnpm docs:build
pnpm docs:preview
```

Open the printed local address, normally `http://localhost:4321`.

## Publishing

The canonical site URL is set in `blume.config.ts`; Blume uses it for canonical URLs, the sitemap, and generated AI-readable documents. Deploy the already-built `dist/` directory to the `cashlift-docs` Vercel project for a production update.
