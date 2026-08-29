---
title: Explainable financial decisions, no invented forecasts
description: Keep financial values and guidance traceable to validated inputs, explicit assumptions, and deterministic calculations.
---

# 0005: Explainable financial decisions, no invented forecasts

- Status: accepted
- Date: 2026-08-27

## Context

Cash forecasts and approval guidance affect real company decisions. Predictive
or AI-assisted features can introduce unsupported amounts, hidden assumptions,
or recommendations that company members cannot reproduce or challenge. A
confident presentation does not make an unverified financial claim trustworthy.

## Decision

Every displayed financial value and recommendation must trace to validated
workspace inputs, explicit assumptions, and deterministic calculations.
AI-assisted features may summarize evidence or propose investigation, but they
must not invent amounts, silently change forecasts, approve spending, or
present predictions as confirmed facts.

## Consequences

- Financial values remain inspectable, reproducible, and testable.
- Derived values must preserve enough provenance to explain their inputs and
  assumptions.
- Confirmed values, deterministic projections, and AI-assisted proposals need
  distinct labels and states.
- CashLift may defer predictive features that cannot meet the provenance and
  explanation contract.
- Tests can assert exact financial behavior without depending on probabilistic
  output.

## Revisit if

Reopen this decision when CashLift has sufficient verified historical data,
measured predictive accuracy, clear provenance and confidence communication,
drift monitoring, authorized human review, and a safe deterministic fallback.
