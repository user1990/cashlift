---
title: Public demo, protected workspace
description: Keep the product tour public without exposing production workspace data.
---

Status: accepted

CashLift keeps an isolated, static product tour public while production workspace routes and workspace data APIs are protected by Clerk. This preserves a low-friction product demo without allowing missing auth configuration to expose `/dashboard/**` or `/api/workspace/**` in production.

## Consequences

- `/demo` is public and contains the audit walkthrough form.
- `/demo/workspace/**` is a public, read-only tour rendered only from the checked-in Studio Nova fixture. It makes no protected workspace requests and exposes no mutation controls.
- `/dashboard/**` and `/api/workspace/**` remain protected and fail closed when production auth or data config is missing.
- The public tour does not change the local `CASHLIFT_APP_MODE=demo` workspace used for development.
