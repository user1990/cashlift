---
name: testing
description: RTL patterns (without driver abstraction), mocking rules (storage/HTTP only — never hooks or Zustand stores), and test data with `chance`. Trigger when writing/fixing tests, adding coverage, or asking how to test a component, hook, or feature.
---

# Testing Guidelines

**Important**: Read the **GUIDE** skill for additional testing patterns, conventions, and best practices that complement this guide.

## Workspace Override

- Driver patterns are deprecated in this workspace.
- Use React Testing Library queries and `user-event` directly in tests.
- Keep the rest of this guide (mocking boundaries, assertion style, selector priorities) unchanged.

## Core Principles

1. **Test Business Logic, Not Implementation**

   - Focus on component's unique responsibilities
   - Don't test what's already covered by base selectors (role, aria-label, etc.)
   - Don't test implementation details (class names, HTML structure)
   - Don't duplicate tests from parent/child components

2. **Component Responsibility**

   - Test data transformation and business rules
   - Test state management specific to the component
   - Test integration between subcomponents when needed
   - Focus on user-facing functionality

3. **Avoid Redundant Tests**
   - Don't test presence of elements that are guaranteed by TypeScript/selectors
   - Don't test library functionality
   - Don't test styling unless it's critical for functionality
   - Don't test basic React behavior

## Critical Anti-Patterns - READ FIRST

**Before writing any test, remember:**

1. **NEVER mock React hooks** - Always use real hooks (`useAuthSession`, `useLogout`, etc.)
2. **NEVER manipulate Zustand stores directly** - Don't use `useAuthStore.setState()` or `getState().actions`
3. **ONLY mock top-level boundaries** - Storage (localStorage/sessionStorage) and HTTP calls (MSW)
4. **Manipulate storage, not stores** - Use `setUserAlreadyAuthenticated()` to set localStorage, then let real hooks read from it
5. **Use real hooks to trigger state changes** - Call `authenticate()` or `logout()` through real hooks, not by manipulating stores

**If you find yourself wanting to mock a hook or manipulate a store, STOP and ask:**

- Can I manipulate localStorage/sessionStorage instead? (YES - do that)
- Can I use a real hook to trigger the state change? (YES - do that)
- Is this a top-level boundary (storage/HTTP)? (NO - don't mock it)

See "Mocking and State Management" for detailed examples and patterns.

## Query and Interaction Patterns

- Render components directly with the repo's test utilities.
- Use `userEvent.setup()` for user interactions.
- Use RTL queries directly in the test body for simple cases.
- Extract local helper functions only when a query, interaction, or assertion is repeated or semantically meaningful.
- Keep helpers in the same test file unless they are reused across files; shared helpers belong in module-local `test-utils.ts`.
- Prefer `within()` for scoped queries and role/name queries for accessible elements.

## Test Organization

1. **Component Tests**

```typescript
describe('ComponentName', () => {
  it('mounts with required props', async () => {
    render(<ComponentName prop="value" />);

    expect(screen.getByRole('region', { name: /component name/i })).toBeInTheDocument();
  });

  it('transforms data according to business rules', () => {
    render(<ComponentName data={mockData} />);

    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(
      expectedFormat,
    );
  });

  describe('specific feature', () => {
    beforeEach(() => {
      setupFeatureScenario();
    });

    it('handles feature-specific logic', () => {
      expect(screen.getByRole('status')).toHaveTextContent(/ready/i);
    });
  });
});
```

2. **Integration Tests**

```typescript
describe('ComponentWithIntegration', () => {
  it('integrates with external service', async () => {
    server.use(createServiceHandler(mockResponse));

    render(<ComponentWithIntegration />);

    expect(await screen.findByText(expectedData.label)).toBeVisible();
  });

  it('adapts to feature flags', async () => {
    setFeatureFlags({ 'feature-name': true });

    render(<ComponentWithIntegration />);

    expect(await screen.findByRole('button', { name: /feature action/i })).toBeVisible();
  });
});
```

## Testing Patterns

1. **Data Transformation Testing**

```typescript
it.each`
  input              | expected
  ${'raw-value'}     | ${'Formatted Value'}
  ${'another-value'} | ${'Another Formatted Value'}
`('formats $input to $expected', ({ input, expected }) => {
  expect(formatFunction(input)).toEqual(expected);
});
```

2. **Async State Testing**

```typescript
it('handles async state changes', async () => {
  render(<ComponentName />);

  expect(screen.getByRole('status')).toHaveTextContent(/loading/i);

  await waitFor(() => {
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  expect(screen.getByRole('main')).toBeVisible();
});
```

3. **Complex UI Interaction Testing**

```typescript
it('handles complex user flows', async () => {
  const user = userEvent.setup();
  render(<ComponentName />);

  await user.click(screen.getByRole('button', { name: /expand/i }));
  await user.click(screen.getByRole('option', { name: /choice/i }));
  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(await screen.findByText(expected.label)).toBeVisible();
});
```

4. **Feature Flag Testing**

```typescript
it('adapts to feature flags', async () => {
  const { unmount } = render(<ComponentName />);

  expect(screen.queryByRole('button', { name: /feature action/i })).not.toBeInTheDocument();

  unmount();
  setFeatureFlags({ 'feature-name': true });
  render(<ComponentName />);

  expect(screen.getByRole('button', { name: /feature action/i })).toBeInTheDocument();
});
```

## Best Practices

1. **Local Helpers**

   - Use direct RTL queries in tests when the selector is clear and used once
   - Extract repeated selectors or multi-step interactions into local helper functions
   - Group related helper functions by behavior, not by DOM structure
   - Use `within()` for scoped queries
   - Return formatted/parsed data instead of raw elements
   - Provide waiting utilities for async operations
   - Avoid helper layers that only rename `screen.getByRole()` without adding meaning

2. **Test Data**

   - Use fixtures for complex data structures
   - Create helper functions for common mock scenarios
   - Keep mock data realistic and minimal
   - Use typed mock data when possible
   - **Always use `chance` for string/ID values**: Instead of hardcoded strings like `'token1'`, `'token2'`, `'user-id'`, etc., use `chance.guid()`, `chance.string()`, `chance.word()`, etc. The `chance` instance is available globally in tests (set up in `dev/jest/setup.js`)

3. **Assertions**

   - Test business outcomes, not implementation
   - Use semantic comparisons
   - Group related assertions
   - Use snapshots sparingly and only for stable data structures
   - **List assertions**: When asserting on lists/arrays, use `toEqual()` to assert the entire expected list rather than checking individual items with `toContain()`:

     ```typescript
     // GOOD: Assert entire list
     expect(getVisibleItems()).toEqual(['Item 1', 'Item 2', 'Item 3']);

     // BAD: Manual checking of each item
     expect(getVisibleItems()).toHaveLength(3);
     expect(getVisibleItems()).toContain('Item 1');
     expect(getVisibleItems()).toContain('Item 2');
     expect(getVisibleItems()).toContain('Item 3');
     ```

4. **Async Testing**

   - Always await async operations
   - Use `waitFor` for state changes
   - Provide clear timeout messages
   - Handle loading states properly

5. **Code Style**

   - Do not add comments in test files
   - Code should be self-documenting through clear variable names and structure
   - Use descriptive test names that explain what is being tested
   - Follow codebase code style guidelines and add empty lines to separate related code blocks
   - **Always follow Biome rules** - fix all linting errors before committing

6. **Imports and Utilities**

   - **`act` usage**: Always import `act` from `test-utils` (or `@your-org/test-utils`) and use it directly. Do not import `act` from `react` or `@testing-library/react` directly
   - Always use `waitFor` from `test-utils` (or `@your-org/test-utils`), not from `react` or `@testing-library/react`
   - Use `@your-org/test-utils` implementations for testing utilities when available
   - For MSW-specific utilities like `HttpResponse`, import directly from `msw` (as fixtures do)
   - Prefer `test-utils` wrappers over direct RTL/MSW imports when available
   - **Always check setup files for defaults**: Before adding setup code in tests (e.g., `clearAuthenticatedUser()`, `server.resetHandlers()`), check `dev/jest/setup.js` and other setup files to see what's already handled in `beforeEach`/`afterEach`. Don't duplicate setup that's already done globally

7. **Test Scope and Performance**

   - Only test what's necessary for the specific test case
   - Avoid testing things that are out of scope or not directly related to the test
   - Don't assert on initial states unless they're relevant to the test outcome
   - **Don't verify test setup**: If you set up state in `beforeEach` or at the start of a test, don't assert that the setup worked - assume it did
   - Prioritize fast-running tests - avoid unnecessary assertions that don't add value
   - Focus on the specific behavior being tested, not all possible states
   - **Exception for callbacks**: If testing a callback prop (e.g., `onSuccess`), verify it was called after the action and wasn't called initially

8. **Testing Implementation Details and State Management**

   - **Don't test implementation details** - focus on observable behavior and user-facing functionality
   - **Last resort exception**: In rare cases where you must verify implementation details (e.g., localStorage, sessionStorage, API calls), wrap them in test utilities colocated with the related implementation
   - These wrappers should be in module `test-utils.ts` files (e.g., `modules/auth/test-utils.ts`)
   - Only use this approach when there's no other way to test the behavior
   - The wrapper abstracts the implementation detail, making tests more maintainable if the implementation changes

9. **Mocking and State Management - CRITICAL RULES**

   - **NEVER mock React hooks** (e.g., `useAuthSession`, `useUser`, `useLogout`) - use real hooks
   - **NEVER directly manipulate Zustand stores** (e.g., `useAuthStore.setState()`, `useAuthStore.getState().actions`) - this is an implementation detail
   - **NEVER create test utilities that manipulate stores directly** - unless it's a documented workaround (see below)
   - **ONLY mock top-level boundaries**: storage (localStorage, sessionStorage) and HTTP calls (via MSW)
   - **Use real hooks to trigger state changes**: If you need to change auth state, render a small test component or use `renderHook()` with the actual `useAuthSession().authenticate()` or `useLogout().logout()` hook
   - **Manipulate storage, not stores**: Use test utilities like `setUserAlreadyAuthenticated()` and `clearAuthenticatedUser()` which manipulate localStorage, then let real hooks read from storage naturally
   - **Workaround exception**: Some test utilities (like `setPendingAuthState`) may need to access store actions directly due to Zustand persist timing issues. These should be clearly documented with comments explaining why it's necessary.

   **Correct Pattern:**

   ```typescript
   import { setUserAlreadyAuthenticated, clearAuthenticatedUser } from '../test-utils';
   import { useAuthSession } from './useAuthSession';
   import { useLogout } from './useLogout';

   it('tests behavior', async () => {
     clearAuthenticatedUser();
     const { result } = renderHook(() => useYourHook());

     act(() => {
       result.current.authSession.authenticate('token', { skipRedirect: true });
     });
   });
   ```

   **Incorrect Patterns:**

   ```typescript
   // BAD: Mocking hooks
   jest.mock('./useAuthSession');
   mockUseAuthSession.mockReturnValue({ authenticated: true });

   // BAD: Directly manipulating stores
   useAuthStore.setState({ accessToken: 'token' });
   useAuthStore.getState().actions.setAccessToken('token');

   // BAD: Creating utilities that manipulate stores (unless documented workaround)
   const setAuthenticatedState = (token: string) => {
     setUserAlreadyAuthenticated(token);
     useAuthStore.getState().actions.setAccessToken(token);
   };
   ```

   **Example Test Structure:**

   ```typescript
   const useCompositeAuthHooks = (props) => {
     const authSession = useAuthSession();
     const logout = useLogout();
     const listener = useGlobalAuthStatusListener(props);
     return { authSession, logout, listener };
   };

   it('calls callback on state change', async () => {
     const onAuthenticated = jest.fn();
     clearAuthenticatedUser();
     const { result } = renderHook(() => useCompositeAuthHooks({ onAuthenticated }));

     act(() => {
       result.current.authSession.authenticate('token', { skipRedirect: true });
     });

     await waitFor(() => {
       expect(onAuthenticated).toHaveBeenCalledTimes(1);
     });
   });
   ```

10. **API Mocking**

    - Create handler functions in module `fixtures.ts` files (e.g., `modules/auth/fixtures.ts`)
    - Use pattern: `create[Action]Handler()` with optional `resolve` parameter (like `createLogoutHandler`)
    - Export handlers and include success handlers in `DEFAULT_[MODULE]_API_HANDLERS` arrays
    - **Always use existing handler functions from fixtures** - don't create new `http.get()` or `http.post()` handlers inline in tests
    - In tests, use `server.use(createHandler(resolve))` to override default handlers when needed
    - For error cases, pass a `resolve` function that returns an error response:
      ```typescript
      server.use(
        createLoginWithCodeHandler(async () => {
          return HttpResponse.json({ message: 'Invalid code' }, { status: 401 });
        }),
      );
      ```
    - Check if endpoint is already mocked in default handlers before adding new mocks
    - For auth API endpoints, use `ENV.authApi.baseUrl`; for main API, use `ENV.api.baseUrl`

    Example fixture pattern:

    ```typescript
    const createLogoutHandler = (resolve?: Parameters<typeof http.get>[1]) =>
      http.get(
        `${ENV.authApi.baseUrl}/logout`,
        resolve ?? (() => HttpResponse.json({}, { status: 200 })),
      );

    const DEFAULT_AUTH_API_HANDLERS = [createLogoutHandler()];

    export { DEFAULT_AUTH_API_HANDLERS, createLogoutHandler };
    ```

    **Mock Function Organization:**

    - Always extract `server.use()` calls into separate `mockSomething` functions
    - Place all mock functions below the test suite (after the closing `});` of the describe block)
    - Use descriptive function names following the pattern: `mock[Feature][Scenario]()` (e.g., `mockMileageWithStoredValue()`, `mockMileageApiError()`)
    - Mock functions should accept necessary parameters and call `server.use()` internally

    Example:

    ```typescript
    describe('ComponentName', () => {
      it('test case', async () => {
        mockMileageWithStoredValue(vin, storedMileage);
      });
    });

    function mockMileageWithStoredValue(vin: string, storedMileage: MileageData) {
      server.use(
        createGetMileageHandler(({ request }) => {
          // ... handler logic
        }),
      );
    }
    ```

11. **RTL Selectors and List Assertions**

    **Pure RTL Selectors:**

    - Always prefer RTL queries (`getByRole`, `getByLabelText`, `getByText`, etc.) to find elements
    - Avoid DOM traversal methods: `closest()`, `parentElement`, `querySelector()`, `getAttribute()`
    - If DOM traversal is unavoidable, consider using test IDs (`data-testid`) as a last resort
    - When you need to extract text, use RTL queries to find elements first, then extract text only when necessary
    - If you find yourself unable to write clean RTL selectors, this may indicate accessibility issues in the component - warn about this and suggest improvements
    - **Look for good examples in `report-viewer`** - search for similar test patterns in the `apps/report-viewer` codebase

    **Semantic HTML and Simple Queries:**

    - **Use semantic HTML elements** (headings, regions, landmarks) in components - they make testing much simpler
    - **Prefer simple role-based queries** over complex text matching when semantic elements are available
    - If a component uses headings (`h1`, `h2`, `h3`, etc.), use `getByRole('heading', { name: /pattern/i })` instead of complex text matching
    - Example:

      ```typescript
      // GOOD: Simple heading query
      getLastKnownMileageText: () => {
        const heading = screen.queryByRole('heading', { name: /last known:/i });
        return heading?.textContent || null;
      };

      // BAD: Complex text matching with filtering
      getLastKnownMileageText: () => {
        const containers = screen.queryAllByText((content, element) => {
          const textContent = element?.textContent || '';
          return textContent.toLowerCase().includes('last known:');
        });
        // ... complex filtering logic
      };
      ```

    - If you find yourself writing complex selectors, check if the component can be improved with semantic HTML instead

    **List Assertions:**

    - When asserting on lists/arrays, use `toEqual()` to assert the entire expected list
    - For checkbox states and similar boolean checks, manually check each item instead of looping:

      ```typescript
      // GOOD
      expect(itemCheckboxes[0]).toBeChecked();
      expect(itemCheckboxes[1]).toBeChecked();
      expect(itemCheckboxes[2]).toBeChecked();

      // BAD
      itemCheckboxes.forEach((checkbox) => {
        expect(checkbox).toBeChecked();
      });
      ```

    **What NOT to do:**

    ```typescript
    // BAD: DOM traversal
    const group = checkbox.closest('[role="group"]');
    const label = group.getAttribute('aria-label');

    // BAD: Class selectors
    const srOnly = group.querySelector('.sr-only');
    ```

    **What to do:**

    ```typescript
    // GOOD: Direct RTL queries
    const groups = within(section).getAllByRole('group');
    const heading = within(group).getByRole('heading');
    const checkbox = within(section).getByRole('checkbox', { name: groupLabel });

    // ACCEPTABLE (last resort): Test IDs when RTL queries aren't possible
    const element = screen.getByTestId('specific-element');
    ```

Tests should verify business requirements and user experience, not implementation details. Focus on testing what the component does, not how it does it.
