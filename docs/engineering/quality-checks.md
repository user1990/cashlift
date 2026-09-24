---
title: Quality checks
description: The checks that protect repository behavior before a change ships.
---

Run the smallest relevant check while iterating, then run the complete appropriate set before handoff.

| Concern | Command |
| --- | --- |
| Formatting and static analysis | `pnpm lint` |
| Type safety | `pnpm typecheck` |
| Unit behavior and coverage thresholds | `pnpm test` |
| Optional duplicate coverage report | `pnpm test:coverage` |
| Workspace dataset performance budget | `pnpm run check:performance` |
| Browser journeys (production build for production-mode suite; demo suite uses dev in CI) | `pnpm test:e2e` |
| Code quality | `pnpm check:code` |
| Agent doc path references | `pnpm check:agents` |
| Dependency and repository security | `pnpm security:check` and `pnpm security:audit` |

End-to-end coverage includes accessibility smoke checks, approval flow behavior, public-demo/auth boundaries, homepage behavior, and instant navigation. Tests should assert intended business behavior, not implementation details.

The CI workflow runs the listed required checks except the optional coverage report, plus the production Next.js build. It also builds the static documentation site so documentation regressions fail before merge.
