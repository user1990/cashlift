---
title: Decision records
description: Durable CashLift decisions that steer future product and architecture work.
---

# Decision records

These records capture durable CashLift decisions that should steer future work.
Read the relevant records before proposing a new primitive, product surface,
data-access path, dependency policy, or security boundary.

## When to add a record

Add a record after an important decision has been made and a future contributor
is likely to revisit it. Focus on product-shaped boundaries and decisions that
would otherwise be proposed again. Do not create one for routine implementation
choices, layout changes, or simply because a pull request shipped.

Copy [`0000-template.md`](./0000-template.md) and use the next available number.
Read this index before choosing the number. If a later record changes an
accepted decision, mark the old record as superseded rather than rewriting it.

## Steering decisions

- [0001 — Baseline JavaScript targets](./0001-baseline-javascript-targets.md)
- [0002 — Public demo, protected workspace](./0002-public-demo-protected-workspace.md)
- [0003 — Clerk-authenticated Supabase RLS](./0003-clerk-authenticated-supabase-rls.md)

## Historical decisions

Superseded decisions remain available here with a link to their replacement.
