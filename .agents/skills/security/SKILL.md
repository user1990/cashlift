---
name: security
description: Authentication/authorization order, Clerk CSRF model, secret handling, and browser-storage rules. Trigger when touching `src/app/api/**`, `src/proxy.ts`, server data loading, Supabase repositories, Clerk session code, Zod schemas at a boundary, environment variables, CI security steps, or any change that reads or writes company data.
---

# Security

Use this skill for anything that crosses a trust boundary. For the deployment view, read `docs/engineering/access-and-data-security.md` only when you need more than the rules below.

CashLift is fail-closed: demo mode serves fixtures with no secrets, and production mode refuses to serve workspace data until Clerk and Supabase are configured.

## Boundary Types

| Boundary | Examples | Auth model |
| --- | --- | --- |
| Protected company data | `/api/v1/workspace/**`, server loaders, Supabase repositories, spend-request decisions | Parse → Clerk session → membership/role → Supabase with user token (RLS) |
| Public read fixtures | `/api/v1/demo/dataset` | Parse inputs only; serve demo dataset; no Clerk session |
| MCP read tool | `/api/mcp` (`get_workspace_dataset`) | Resolve through `resolveWorkspaceDataset`; demo or structured auth error; never mutate |
| Deprecated shims | `/api/workspace/**` | Delegate to v1 handlers; do not add new behavior on unversioned paths |

## Protected Company-Data Order

For routes and server code that read or mutate a signed-in company's workspace data, follow this order. Do not reorder or skip a step.

1. **Parse** the request with Zod (`safeParse`) and reject invalid input with 400.
2. **Authenticate** with Clerk and reject a missing session with 401.
3. **Authorize** by loading the caller's company membership and checking the role, returning 403 on failure.
4. **Query** through the server Supabase client with the request access token, so RLS enforces company scope as the final authority.

`src/modules/workspace/spendRequestDecisions.ts` is the reference implementation. Never treat a client-supplied user ID, company ID, or role as authority.

## Request Rules

- CSRF is Clerk `SameSite=Lax` cookies plus same-origin JSON mutations. Do not add a custom origin firewall, CSRF tokens, or Upstash on `/login`.
- Workspace mutations stay JSON `PATCH`/`POST` on `/api/v1/workspace/**` (and legacy `/api/workspace/**` shims only while they exist). Never change state on GET.
- Do not add `Access-Control-Allow-Origin`. CORS would let other sites call the cookie-backed API.
- Keep CSP, HSTS, COOP/CORP, frame protection, referrer policy, and the permissions policy in `src/proxy.ts`. Widening CSP needs a specific origin and a test in `src/proxy.test.ts`.

## Client Rules

- Render user text through JSX. Use `dangerouslySetInnerHTML` only with sanitized, reviewed HTML.
- Do not store auth or session tokens in `localStorage` or `sessionStorage`, and do not read `document.cookie` from client code.
- Client validation is never authorization. Parse every submitted value again on the server.

## Data And Secrets

- Keep RLS policies in `supabase/`. Application checks do not replace a policy.
- Use the Supabase query builder. Never concatenate SQL from request input.
- Production policies must not grant to `anon` and must not contain demo policies; `pnpm security:check` fails on both.
- Secrets live in environment variables. Never commit an `.env` file or a service-role, Clerk, or Sentry token.
- Keep telemetry identifiers to request/correlation IDs.

## Verification

```bash
pnpm security:check
pnpm security:audit
pnpm test
```

A new protected state-changing route still needs 401 without a session and 403 for the wrong role. A new or changed header needs an assertion in `src/proxy.test.ts`.
