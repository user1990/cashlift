---
title: Quality checks
description: The checks that protect repository behavior before a change ships.
---

Run the smallest relevant check while iterating, then run the complete appropriate set before handoff.

| Concern | Command |
| --- | --- |
| Formatting and static analysis | `pnpm lint` |
| Type safety | `pnpm typecheck` |
| Unit behavior | `pnpm test` |
| Runtime coverage report | `pnpm test:coverage` |
| Browser journeys | `pnpm test:e2e` |
| Code quality | `pnpm check:code` |
| Dependency and repository security | `pnpm security:check` and `pnpm security:audit` |
| Browser JavaScript necessity | [Baseline decision record](/engineering/baseline-javascript) before adding a production client library or polyfill |

End-to-end coverage includes accessibility smoke checks, approval flow behavior, public-demo/auth boundaries, homepage behavior, and instant navigation. Tests should assert intended business behavior, not implementation details.

The CI workflow runs these checks, plus the production Next.js build. It also builds the static documentation site so documentation regressions fail before merge.
