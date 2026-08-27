---
title: Baseline JavaScript targets
description: Use Web Platform Baseline status to decide when CashLift may rely on a native API instead of shipping JavaScript.
---

# 0001: Baseline JavaScript targets

- Status: accepted
- Date: 2026-08-20

## Context

CashLift serves public marketing and checkout surfaces, a public demo, and an
authenticated workspace with different compatibility and delivery needs. The
product should keep first paint and shipped client code small without replacing
real use cases with incomplete browser APIs or oversized polyfills.

## Decision

Use [Web Platform Baseline](https://webstatus.dev/) as the compatibility source
of truth. Do not add a production JavaScript library, polyfill, or third-party
script when a Baseline-safe platform feature covers the real use case. Public
marketing, checkout, and demo first paint target “Widely available”; the
authenticated workspace may use “Newly available” with a feature check or
fallback.

## Consequences

- Server Components remain the default delivery path; client JavaScript stays
  at interactive leaves.
- Keep the Next.js default client polyfills disabled and use native `fetch`,
  `Intl`, and browser APIs where they cover the feature.
- Keep feature-specific dependencies such as React Aria calendar support when
  the native platform does not cover the real use case.
- A proposed dependency or polyfill must pass the audience-safety, swap-cost,
  and real-use-case questions before it is added.

## Revisit if

Reopen this decision when a required product flow cannot meet its compatibility
or accessibility contract with the available platform feature and an explicit
fallback, or when Baseline definitions materially change.
