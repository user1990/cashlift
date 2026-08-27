---
title: Decision support, not money movement
description: Keep CashLift focused on understanding and authorizing cash decisions without moving or custodying money.
---

# 0004: Decision support, not money movement

- Status: accepted
- Date: 2026-08-27

## Context

CashLift connects approvals, receivables, vendor bills, budgets, and runway in
one company workspace. As those workflows become more complete, payment
initiation, bank transfers, custody, or automatic settlement can appear to be
the next natural product step. Those capabilities would materially change the
product’s regulatory, fraud, reconciliation, security, and operational duties.

## Decision

CashLift helps company members understand and authorize cash decisions, but it
does not move or custody money. An approved action may be exported or handed
off to an accounting, banking, or payment system, but CashLift does not silently
execute it.

## Consequences

- “Approved in CashLift” remains distinct from “executed externally.”
- Integrations may import status and export approved actions without becoming
  transaction engines.
- CashLift avoids storing payment credentials or owning transfer execution,
  reconciliation, and settlement failures.
- Product copy and interface states must use “approve,” “hand off,” and
  “executed externally” precisely rather than implying that CashLift paid an
  invoice or moved funds.

## Revisit if

Reopen this decision when validated customer demand requires native execution
and CashLift has an explicit compliance, fraud-control, authorization,
reconciliation, incident-response, and operational model capable of supporting
it.
