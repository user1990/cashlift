---
name: testing
description: RTL patterns (without driver abstraction), mocking rules (storage/HTTP only — never hooks or Zustand stores), and test data with `chance`. Trigger when writing/fixing tests, adding coverage, or asking how to test a component, hook, or feature.
---

# Testing Guidelines

Use this skill for test changes. Read `.agents/docs/testing.md` only when you need detailed examples, fixture patterns, or selector edge cases. Also apply `.agents/skills/guide/SKILL.md` for general code style.

## Workspace Rules

- Driver patterns are deprecated. Use React Testing Library queries and `user-event` directly.
- Render with React Testing Library directly, or through a local test utility when one already exists for the area.
- Use the `act` and `waitFor` helpers provided by the local test setup when available.
- Check setup files before adding setup/teardown; do not duplicate global resets or handlers.
- Do not add comments in tests unless documenting a necessary workaround.
- Fix Biome/lint issues before finishing.

## What To Test

- Test business behavior and user outcomes, not implementation details.
- Prefer fewer, longer tests when several assertions belong to one meaningful user or API workflow. Keep the setup in one place and assert the intermediate and final outcomes that make the workflow trustworthy; do not split a flow into tiny tests to enforce one assertion per test.
- Prefer top-level components/pages/screens when that best captures the workflow.
- Test component-specific data transformation, state, integration, and feature-flag behavior.
- For derived UI, cover the supplied data that proves each displayed amount, comparison, and label; do not lock invented copy into a snapshot.
- For a shared mutation, keep it pending in the test and assert every conflicting action is disabled.
- For time-sensitive UI, test the client-visible date/state and preserve a deterministic server-safe fallback.
- Avoid testing TypeScript guarantees, library behavior, class names, HTML structure, default setup, or unrelated initial states.
- Do not pin incidental copy, tool descriptions, warnings, or configuration strings when a structured contract or observable behavior can be tested instead.
- Keep the bar high for slower integration and E2E tests: use them only for a boundary or user journey that a faster test cannot honestly falsify.
- Before adding a regression test, confirm the bug is important and plausibly repeatable. Retain the test only when it protects a meaningful contract; otherwise fold it into an existing workflow test or remove it after the fix is verified.
- Group related assertions in one `it` when they describe one behavior.
- Use `it.each` for repetitive cases.

## Test Suite Maintenance

- During changes in a test area, review nearby tests for duplicate setup, overlapping assertions, incidental string pinning, and cases covered more directly by an existing workflow.
- Prefer editing or combining low-signal tests over adding another case. Do not remove coverage of a business rule, security boundary, user-critical journey, or stable public contract merely to reduce test count.
- Keep new tests offline-capable and deterministic. If a test cannot explain what regression it would catch, it does not belong in the suite.

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
- Use relative paths for same-origin app routes. For external APIs, use the existing environment-backed base URL instead of hardcoding an origin.

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
- Name constant fixture/mock values in `UPPER_SNAKE_CASE` with a `_MOCK` suffix.
- Prefer deterministic, named fixture values. Use generated values only when a test genuinely needs them and the repository's generator is available.
- Assert business outcomes and semantic values.
- Use snapshots only for stable data structures.
- For lists/arrays, assert the full expected list with `toEqual()`.
- For checkbox and similar boolean states, manually assert each relevant item instead of looping.
- Verify callback props after the triggering action; do not assert they were initially uncalled unless that is the behavior under test.

## Final Check

Before finishing a test change, verify selectors reflect user-accessible behavior, mocks stay at storage/HTTP boundaries, setup is not duplicated, and changed tests pass or report why they could not be run.
