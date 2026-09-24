---
name: testing
description: RTL patterns, layer-based mocking, MSW fixtures, and deterministic test data. Trigger when writing/fixing tests, adding coverage, or asking how to test a component, hook, or feature.
---

# Testing Guidelines

Use this skill for test changes. Read `.agents/docs/testing.md` only when you need examples or selector edge cases. Apply `.agents/skills/guide/SKILL.md` for general code style.

## Workspace Rules

- Driver patterns are deprecated. Use React Testing Library queries and `user-event` directly.
- Render with React Testing Library directly, or through a local test utility when one already exists for the area.
- Use the `act` and `waitFor` helpers provided by the local test setup when available.
- Check setup files before adding setup/teardown; do not duplicate global resets or handlers.
- Do not add comments in tests unless documenting a necessary workaround.
- Fix Biome/lint issues before finishing.

## What To Test

- Test business behavior and user outcomes, not implementation details.
- Prefer fewer, longer tests when several assertions belong to one meaningful user or API workflow.
- Prefer top-level components/pages/screens when that best captures the workflow.
- For derived UI, cover the supplied data that proves each displayed amount, comparison, and label; do not lock invented copy into a snapshot.
- For a shared mutation, keep it pending in the test and assert every conflicting action is disabled.
- For time-sensitive UI, prefer `vi.setSystemTime` and the client-visible date/state; preserve a deterministic server-safe fallback.
- Avoid testing TypeScript guarantees, library behavior, class names, HTML structure, default setup, or unrelated initial states.
- Keep the bar high for slower integration and E2E tests: use them only for a boundary or user journey that a faster test cannot honestly falsify.
- Group related assertions in one `it` when they describe one behavior. Use `it.each` for repetitive cases.

## Mocking By Layer

| Layer | Mock? | Notes |
| --- | --- | --- |
| HTTP / same-origin API | Yes | MSW via `src/test/server.ts` and module `fixtures.ts` factories |
| Clerk, Supabase, Sentry adapters | Yes | `vi.mock` platform modules at the integration boundary |
| React hooks that only wrap browser time | Prefer not | Use `vi.setSystemTime`; if a hook must be mocked, document why in the test file |
| Feature business hooks and components under test | No | Render real components and call real hooks |
| `localStorage` / `sessionStorage` | Rare | CashLift does not use these for auth; mock only when testing a utility that explicitly uses storage |

Never mock a hook merely to skip rendering its subtree when the behavior under test depends on that subtree.

## HTTP And Fixtures

- Use `src/test/fixtures/*` handler factories before adding new handlers.
- Handler factories follow `create[Action]Handler(resolve?)` and default success handlers belong in `DEFAULT_[MODULE]_API_HANDLERS`.
- In tests, override with `server.use(createHandler(resolve))`.
- Use relative paths for same-origin app routes.

## Queries And Interactions

- Prefer role/name queries, then label/text queries, then `data-testid` as a last resort.
- Use `within()` for scoped queries.
- Use `userEvent.setup()` for interactions and always await async user operations.
- Use `waitFor` for async state transitions and loading completion.

## Data And Assertions

- Keep fixtures realistic and minimal. Name constants in `UPPER_SNAKE_CASE` with a `_MOCK` suffix when shared.
- Assert business outcomes and semantic values. Use snapshots only for stable data structures.
- For lists/arrays, assert the full expected list with `toEqual()`.

## Final Check

Before finishing, verify selectors reflect accessible behavior, mocks stay at the right boundary, setup is not duplicated, and changed tests pass or report why they could not be run.
