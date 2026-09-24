---
title: Performance budgets
description: Repository-local performance gates and field monitoring expectations.
---

## Field monitoring

Speed Insights and Sentry are installed for production traffic. Use their dashboards for real-user Web Vitals and error regressions; installing instrumentation is not a substitute for reviewing distributions after releases.

## Repository gates

| Gate | Command | Budget |
| --- | --- | --- |
| Demo dataset scope reduction | `pnpm run check:performance` | Completes in under 2 seconds on CI hardware |

Raise budgets only with evidence from `pnpm run check:performance` output and a note in the pull request. Add route-level bundle budgets when a second product depends on shared packages.
