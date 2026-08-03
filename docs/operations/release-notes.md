---
title: Release notes
description: Engineering-facing notes for operational and repository changes.
---

## 2026-08-03 — Repository hardening

- Added contract tests for the workspace dataset schema and spend-decision client boundary.
- Tightened workspace date validation to reject impossible ISO calendar dates.
- Encoded spend-request route identifiers and normalized malformed success responses to a stable client error.
- Corrected retired `/app` references so onboarding and accessibility coverage exercise `/dashboard`.
- Documented module contracts, known coupling pressure points, and workspace incident diagnosis.
- Refreshed mature direct dependencies under the repository's one-week release-age policy.
- Updated the Valibot security override and removed expired release-age exceptions.
