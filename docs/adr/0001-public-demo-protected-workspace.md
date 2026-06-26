# Public demo, protected workspace

Status: accepted

CashLift keeps marketing demo flows public while production workspace routes and workspace data APIs are protected by Clerk. This preserves a low-friction product demo without allowing missing auth configuration to expose `/app` or `/api/workspace/dataset` in production.

## Consequences

- `/demo` is public and can describe or preview the product.
- `/app/**` and workspace data APIs fail closed when production auth or data config is missing.
- Demo workspace data is only available when `CASHLIFT_APP_MODE=demo`.
