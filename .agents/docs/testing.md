# Testing Reference

This reference preserves the detailed testing guidance while keeping the hot-path `testing` skill compact. Load it only when examples, fixture structure, or selector tradeoffs are needed.

## Core Principles

- Test business logic and user-facing outcomes, not implementation details.
- Focus on a component's unique responsibility: data transformation, business rules, state behavior, and integration between child components when needed.
- Avoid redundant tests for behavior already guaranteed by TypeScript, accessible selectors, framework/library behavior, parent/child tests, or global setup.
- Prefer top-level component/page tests when they capture the user workflow without excessive setup.

## Organization

- Use direct RTL queries and `user-event` in the test body for simple cases.
- Extract local helpers only for repeated selectors, repeated interactions, or meaningful domain actions.
- Keep helpers in the same test file unless reused across files; shared helpers belong in a module-local `test-utils.ts`.
- Group helpers by behavior, not DOM structure.
- Place mock helper functions below the test suite.
- Use descriptive test names and clear variables instead of comments.
- Add blank lines between arrange, act, and assert blocks when it improves scanability.

## Mocking And State

Critical rules:

- Never mock React hooks.
- Never manipulate Zustand stores directly.
- Never create store-manipulating test utilities unless the workaround is documented.
- Mock only storage and HTTP boundaries.
- Manipulate localStorage/sessionStorage through test utilities, then let real hooks read state.
- Use real hooks through components or `renderHook()` to trigger auth/session state changes.

Correct shape:

```ts
const { result } = renderHook(() => useCompositeHooks({ onAuthenticated }));

act(() => {
  result.current.authSession.authenticate(token, { skipRedirect: true });
});

await waitFor(() => {
  expect(onAuthenticated).toHaveBeenCalledTimes(1);
});
```

Incorrect shapes include `jest.mock("./useAuthSession")`, `useAuthStore.setState(...)`, or helper utilities that call store actions unless documented as a persist-timing workaround.

## HTTP Fixtures

- Create handler factories in module `fixtures.ts` files.
- Use `create[Action]Handler(resolve?)`.
- Export default success handlers through `DEFAULT_[MODULE]_API_HANDLERS`.
- Prefer existing handlers before writing inline `http.get()`/`http.post()` mocks.
- Override cases with `server.use(createHandler(resolve))`.
- For error cases, pass a resolver returning `HttpResponse.json(..., { status })`.
- Use relative paths for same-origin app routes. For external APIs, use the existing environment-backed base URL instead of hardcoding an origin.
- Extract `server.use()` calls into `mock[Feature][Scenario]()` helpers below the describe block.

## Selectors

- Prefer `getByRole`, `getByLabelText`, `getByText`, and other RTL queries over DOM traversal.
- Use `within()` to scope queries.
- Avoid `closest()`, `parentElement`, `querySelector()`, `getAttribute()`, and class selectors.
- Use test IDs only as a last resort when semantic queries are not possible.
- If clean RTL selectors are difficult, consider improving semantic HTML first with headings, landmarks, regions, labels, or accessible names.
- Prefer heading/role queries over complex text filtering when the component can expose semantics.

## Async And Interactions

- Use `userEvent.setup()` and await async interactions.
- Assert loading state only when relevant to the behavior under test.
- Use `waitFor` for state transitions and disappearance of async UI.
- Avoid unnecessary timeout-heavy assertions.

## Test Data

- Keep fixtures realistic, minimal, and typed.
- Name constant fixture/mock values in `UPPER_SNAKE_CASE` with a `_MOCK` suffix.
- Use global `chance` for generated string and ID values such as tokens, user IDs, GUIDs, and arbitrary labels.
- Avoid hardcoded placeholder IDs such as `"token1"` or `"user-id"` unless the literal value is itself meaningful.

## Assertions

- Assert business outcomes and semantic values.
- For lists/arrays, use `toEqual()` against the whole expected list instead of length plus repeated `toContain()`.
- For checkbox states and similar boolean checks, manually assert the relevant items rather than looping.
- Use snapshots sparingly and only for stable data structures.
- Do not verify setup unless setup itself is the subject under test.
- For callback props, verify they were called after the user action; initial uncalled assertions are only useful when they express a requirement.

## Common Patterns

Data transformation:

```ts
it.each`
  input          | expected
  ${"raw-value"} | ${"Formatted Value"}
`("formats $input", ({ input, expected }) => {
  expect(formatValue(input)).toEqual(expected);
});
```

Complex interaction:

```ts
const user = userEvent.setup();
render(<ComponentName />);

await user.click(screen.getByRole("button", { name: /expand/i }));
await user.click(screen.getByRole("option", { name: /choice/i }));
await user.click(screen.getByRole("button", { name: /submit/i }));

expect(await screen.findByText(expected.label)).toBeVisible();
```

Feature flags:

```ts
const { unmount } = render(<ComponentName />);

expect(screen.queryByRole("button", { name: /feature action/i })).not.toBeInTheDocument();

unmount();
setFeatureFlags({ "feature-name": true });
render(<ComponentName />);

expect(screen.getByRole("button", { name: /feature action/i })).toBeInTheDocument();
```
