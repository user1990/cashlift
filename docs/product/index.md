---
title: Product guide
description: The decisions and workspace areas CashLift brings together.
---

CashLift does not move money. It helps finance teams make decisions before cash gets tight.

## Core workflows

| Workspace area | Decision it supports |
| --- | --- |
| Overview and Cash Insights | Understand cash buffer, inflows, outflows, payroll, and runway context. |
| Approvals | Decide whether a requested spend is safe, with the vendor, team, reason, and cash impact visible. |
| Invoices | Prioritize receivables by status, owner, due date, and collection probability. |
| Vendors | Find renewal risk, duplicate subscriptions, and low-usage vendor spend. |
| Budgets | Compare committed and approved spending with each team's monthly budget. |
| Team and Settings | View workspace members and workspace-level configuration. |

## Workspace modes

The public demo is a static, read-only product tour. Local development can use the same kind of typed fixture data. Production dashboard routes load an authenticated company's data from Supabase.

The distinction matters: a public tour must never become an unprotected path to production workspace data or mutations.
