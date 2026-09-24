# 0006 — Reference implementation, not universal SSOT

## Status

Accepted

## Context

CashLift encodes strong engineering conventions, but copying the entire repository would fork unrelated finance product assumptions and integrations.

## Decision

- CashLift is the **reference implementation** for similar React/Next.js business applications.
- **Engineering standards** live in `.agents/skills/`, `docs/engineering/`, and executable checks (`pnpm check:modules`, `pnpm test`, `pnpm test:e2e`).
- **Canonical examples** are listed in `docs/engineering/canonical-examples.md` and must stay aligned with tests.
- **Shared packages** under `packages/` are created only when a second product needs synchronized maintenance.

## Consequences

- Production-mode end-to-end tests run against production builds (`next build` + `next start`). Demo workspace journeys use a production build locally when `CASHLIFT_ALLOW_DEMO_PRODUCTION_BUILD` is set; CI keeps `pnpm dev` for demo suites until demo mode is verified on production artifacts.
- Documentation must match installed tooling (no prescribed libraries that the app does not use).
- Portability is proven by reusing canonical examples, not by declaring the whole repo a framework.
