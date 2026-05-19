---
name: testing
description: RTL patterns (without driver abstraction), mocking rules (storage/HTTP only — never hooks or Zustand stores), and test data with `chance`. Trigger when writing/fixing tests, adding coverage, or asking how to test a component, hook, or feature.
---

# Testing Guidelines

Use this skill for test changes. Read `.agents/docs/testing.md` only when you need detailed examples, fixture patterns, or selector edge cases. Also apply `.agents/skills/guide/SKILL.md` for general code style.

## Workspace Rules

- Driver patterns are deprecated. Use React Testing Library queries and `user-event` directly.
- Render through the repo's test utilities. Prefer exported local test helpers only when already established.
- Use `act` and `waitFor` from repo test utilities, not directly from React or Testing Library.
- Check setup files before adding setup/teardown; do not duplicate global resets or handlers.
- Do not add comments in tests unless documenting a necessary workaround.
- Fix Biome/lint issues before finishing.

## What To Test

- Test business behavior and user outcomes, not implementation details.
- Prefer top-level components/pages/screens when that best captures the workflow.
- Test component-specific data transformation, state, integration, and feature-flag behavior.
- Avoid testing TypeScript guarantees, library behavior, class names, HTML structure, default setup, or unrelated initial states.
- Group related assertions in one `it` when they describe one behavior.
- Use `it.each` for repetitive cases.

## Mocking Boundaries

- Never mock React hooks such as `useAuthSession`, `useUser`, or `useLogout`.
- Never manipulate Zustand stores directly with `setState()` or `getState().actions`.
- Mock only top-level boundaries: storage (`localStorage`/`sessionStorage`) and HTTP via MSW.
- Manipulate storage with module test utilities, then let real hooks read it.
- Use real hooks or `renderHook()` to trigger state changes.
- Store-manipulating test utilities are allowed only as documented workarounds for framework timing issues.

## HTTP And Fixtures

- Use existing module `fixtures.ts` handler factories before adding new handlers.
- Handler factories follow `create[Action]Handler(resolve?)` and default success handlers belong in `DEFAULT_[MODULE]_API_HANDLERS`.
- In tests, override with `server.use(createHandler(resolve))`.
- Extract `server.use()` setups into descriptive `mock[Feature][Scenario]()` helpers below the test suite.
- For auth endpoints use `ENV.authApi.baseUrl`; for main API use `ENV.api.baseUrl`.

## Queries And Interactions

- Prefer role/name queries, then label/text queries, then `data-testid` as a last resort.
- Use semantic HTML in components so tests can use simple accessible queries.
- Use `within()` for scoped queries.
- Avoid DOM traversal (`closest`, `parentElement`, `querySelector`, `getAttribute`). If traversal feels necessary, first consider whether the component needs better accessibility.
- Use `userEvent.setup()` for interactions and always await async user operations.
- Use `waitFor` for async state transitions and loading completion.

## Data And Assertions

- Keep fixtures realistic and minimal.
- Use typed mock data where possible.
- Always use global `chance` for generated string/ID values instead of hardcoded tokens or IDs.
- Assert business outcomes and semantic values.
- Use snapshots only for stable data structures.
- For lists/arrays, assert the full expected list with `toEqual()`.
- For checkbox and similar boolean states, manually assert each relevant item instead of looping.
- Verify callback props after the triggering action; do not assert they were initially uncalled unless that is the behavior under test.

## Final Check

Before finishing a test change, verify selectors reflect user-accessible behavior, mocks stay at storage/HTTP boundaries, setup is not duplicated, and changed tests pass or report why they could not be run.
