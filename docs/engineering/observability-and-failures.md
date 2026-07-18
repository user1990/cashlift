---
title: Observability and failures
description: Report actionable failures while keeping user-facing messages safe.
---

CashLift uses Sentry at the Next.js runtime boundaries and inside feature services. A failure should have enough context to group and investigate it, while the UI shows a stable, non-sensitive message.

## Failure rules

- Capture unexpected exceptions through the shared Sentry integration, with a feature tag and stable fingerprint.
- Attach operational context only when it is needed to diagnose the issue. Do not attach secrets, access tokens, or unnecessary personal data.
- Map expected states—unauthenticated, forbidden, incomplete configuration, and unavailable services—to explicit UI states.
- Keep generic error text in the UI and retain the Sentry event ID only as a support reference when available.
- Use `global-error.tsx` as the final UI boundary, not as a replacement for handling expected feature failures.

For example, workspace loading distinguishes missing membership from authentication-service failure and data-service failure; each is visible to the user in the right form and observable with a distinct Sentry fingerprint.
