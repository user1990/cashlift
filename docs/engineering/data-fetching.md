---
title: Data fetching and mutations
description: Keep the server-rendered workspace and browser cache coherent.
---

Workspace pages begin with data loaded on the server. Interactive sections then use React Query with that same dataset as `initialData`, avoiding a duplicate request during hydration.

Browser transport stays on `fetch` plus feature-level Zod parsing. Do not add an HTTP client library.

## Query rules

- Keep query keys in the feature that owns the data. Include every server-affecting input, such as workspace scope and date range.
- Parse API responses with the feature schema before they enter the cache.
- Use server data as `initialData`; set `initialDataUpdatedAt: 0` when the supplied dataset does not match the active filters, so React Query refetches immediately.
- Do not put server data in global client state merely to share it between route sections.

## Mutation rules

- Prefer an optimistic update only when the UI can describe and reverse it precisely.
- Cancel in-flight queries, snapshot the affected cache entries, update the cache, then restore the snapshot in `onError`.
- On success, write the authoritative response back into every affected query and give the user clear feedback.
- Keep mutation functions in the feature API module; components coordinate the interaction, not transport details.

The spend-request approval queue follows this pattern: a decision is shown immediately, rolled back if the request fails, and replaced with the server response on success.
