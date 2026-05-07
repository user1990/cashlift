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

See section 9 for detailed examples and patterns.

## Driver Patterns

1. **Component Driver Pattern**

```typescript
const driver = createComponentDriver({
  Component: YourComponent,
  defaultProps: { id: 'component-id' },
  actions: {
    getRecords: () => screen.getAllByRole('article').map(formatRecord),

    expandRecord: async (index: number) => {
      const record = driver.getRecords()[index];
      await driver.user.click(within(record).getByRole('button'));
    },

    waitForComponent: () =>
      waitFor(() => expect(screen.getByText('Expected Text')).toBeInTheDocument()),

    mountAndWait: async (props = {}) => {
      driver.mount(props);
      await driver.waitForComponent();
    },
  },
});
```

2. **Section Driver Pattern**

```typescript
const driver = createSectionDriver({
  Component: YourSection,
  defaultProps: { id: 'section-id' },
  actions: {
    waitForSection: () => driver.waitForSection('Section Name'),

    getSubsectionLabels: () =>
      screen
        .queryAllByRole('heading', { level: 3 })
        .map((element) => element.textContent)
        .filter(Boolean),

    getBasicCardInfo: (card: HTMLElement) => ({
      label: within(card).getByRole('heading').textContent,
      hasRecords: cardHasRecords(card),
      date: extractDate(card),
      metadata: extractMetadata(card),
    }),
  },
});
```

3. **Hook Driver Pattern**

```typescript
const driver = createHookDriver({
  hook: useYourHook,
  actions: {
    performActionAndWait: async () => {
      driver.act(() => {
        driver.getCurrent().someMethod();
      });
      await driver.waitFor(() => {
        expect(driver.getCurrent().someState).toBe(true);
      });
    },

    expectStateToMatch: async (expectedState) => {
      await driver.waitFor(() => {
        expect(driver.getCurrent()).toEqual(expectedState);
      });
    },
  },
});
```

## Test Organization

1. **Component Tests**

```typescript
describe('ComponentName', () => {
  it('mounts with required props', async () => {
    await driver.mountAndWait({ prop: 'value' });
    expect(driver.getRoot()).toBeInTheDocument();
  });

  it('transforms data according to business rules', () => {
    driver.mount({ data: mockData });
    expect(driver.getFormattedData()).toEqual(expectedFormat);
  });

  describe('specific feature', () => {
    beforeEach(() => {
      // Feature-specific setup
    });

    it('handles feature-specific logic', () => {
      // Feature test
    });
  });
});
```

2. **Integration Tests**

```typescript
describe('ComponentWithIntegration', () => {
  it('integrates with external service', async () => {
    server.use(createServiceHandler(mockResponse));
    await driver.mountAndWait();
    expect(driver.getIntegratedData()).toEqual(expectedData);
  });

  it('adapts to feature flags', async () => {
    setFeatureFlags({ 'feature-name': true });
    await driver.mountAndWait();
    expect(driver.getFeatureElements()).toBeVisible();
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
  driver.mount({});

  expect(driver.getLoadingState()).toBe(true);

  await waitFor(() => {
    expect(driver.getLoadingState()).toBe(false);
  });

  expect(driver.getContent()).toBeVisible();
});
```

3. **Complex UI Interaction Testing**

```typescript
it('handles complex user flows', async () => {
  await driver.mountAndWait();

  await driver.expandSection();
  await driver.selectOption('choice');
  await driver.submitForm();

  expect(driver.getSubmissionResult()).toEqual(expected);
});
```

4. **Feature Flag Testing**

```typescript
it('adapts to feature flags', async () => {
  await driver.mountAndWait();
  expect(driver.getFeatureElement()).not.toBeInTheDocument();

  setFeatureFlags({ 'feature-name': true });
  await driver.mountAndWait();
  expect(driver.getFeatureElement()).toBeInTheDocument();
});
```

## Best Practices

1. **Driver Actions**

   - **Always put repetitive selectors in driver config, never use raw selectors in tests**
   - Do not use raw selectors (e.g., `screen.getByRole`, `screen.getByText`) directly in tests - wrap them in driver actions
   - Group related selectors into semantic actions
   - Handle complex UI interactions (clicks, form submissions, etc.) in driver actions
   - Use `within()` for scoped queries
   - Return formatted/parsed data instead of raw elements
   - Provide waiting utilities for async operations
   - Simple wrappers around `act()` or hook method calls are usually unnecessary - only add actions for complex interactions

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
     expect(driver.getVisibleItems()).toEqual(['Item 1', 'Item 2', 'Item 3']);

     // BAD: Manual checking of each item
     expect(driver.getVisibleItems()).toHaveLength(3);
     expect(driver.getVisibleItems()).toContain('Item 1');
     expect(driver.getVisibleItems()).toContain('Item 2');
     expect(driver.getVisibleItems()).toContain('Item 3');
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

   - **`act` usage**: Always import `act` from `test-utils` (or `@your-org/test-utils`) and use it directly. **Never use `driver.act()`** - always use the imported `act` function. Do not import `act` from `react` or `@testing-library/react` directly
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
   - **Use real hooks to trigger state changes**: If you need to change auth state, use the actual `useAuthSession().authenticate()` or `useLogout().logout()` hooks through a driver
   - **Manipulate storage, not stores**: Use test utilities like `setUserAlreadyAuthenticated()` and `clearAuthenticatedUser()` which manipulate localStorage, then let real hooks read from storage naturally
   - **Workaround exception**: Some test utilities (like `setPendingAuthState`) may need to access store actions directly due to Zustand persist timing issues. These should be clearly documented with comments explaining why it's necessary.

   **Correct Pattern:**

   ```typescript
   import { setUserAlreadyAuthenticated, clearAuthenticatedUser } from '../test-utils';
   import { useAuthSession } from './useAuthSession';
   import { useLogout } from './useLogout';

   const driver = createHookDriver({
     hook: useYourHook,
     actions: {
       authenticate: () => {
         driver.getCurrent().authSession.authenticate('token', { skipRedirect: true });
       },
     },
   });

   it('tests behavior', async () => {
     clearAuthenticatedUser();
     driver.mount();
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

   const driver = createHookDriver({
     hook: useCompositeAuthHooks,
     actions: {
       authenticate: () =>
         driver.getCurrent().authSession.authenticate('token', { skipRedirect: true }),
       logout: () => driver.getCurrent().logout.logout(),
     },
   });

   it('calls callback on state change', async () => {
     clearAuthenticatedUser();
     driver.mount({ onAuthenticated: jest.fn() });

     driver.act(() => {
       driver.authenticate();
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
