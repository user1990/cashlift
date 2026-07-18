---
title: Access and data security
description: Protect workspace data across Clerk, Supabase, and the Next.js request boundary.
---

Workspace routes and workspace APIs require a Clerk session. The request path then carries a Clerk-issued token into the server Supabase client, where row-level security remains the final authority for company data.

## Access rules

- Authenticate before loading protected data; never treat a client-provided user or company ID as authority.
- Use the server Supabase client with the request access token for workspace reads and writes.
- Keep data policies in `supabase/`; application checks improve UX but do not replace RLS.
- Preserve the public demo as a separate, read-only route path. It must not weaken production workspace protection.
- Treat environment configuration as a server boundary and fail with a clear configuration state when required values are missing.

## Request rules

- Keep the proxy security headers intact: CSP, HSTS in production, frame protection, referrer policy, and restrictive permissions policy.
- Do not store Clerk tokens in browser storage.
- Keep secrets, service-role credentials, and Sentry auth tokens out of committed files; `pnpm security:check` enforces this before handoff.
