# Frontend Guide

The definitive guide to frontend development.

#### Updating this guide

All updates to this guide should be done through the regular pull request workflow. Changes to the technologies, our process, or how we write code, are **substantial**, and must produce a consensus among the team. Thus, such updates need to be marked with a ![proposal](https://img.shields.io/badge/proposal-0E8A16) label and the majority of the team should be summoned for review and discussion.

### Table of Contents

- [Technology Stack](#technology-stack)
- [Security Guidelines](#security-guidelines)
- [Feature Delivery Workflow](#feature-delivery-workflow)
- [Source Control (Git)](#source-control-git)
- [Coding Style & Conventions](#coding-style--conventions)
  - [File structure](#file-structure)
  - [JavaScript](#javascript)
  - [TypeScript](#typescript)
  - [React](#react)
  - [CSS](#css)
- [Testing](#testing)
- [Continuous Integration & Deployment](#continuous-integration--deployment)
- [Continuous Learning](#continuous-learning)

## Technology Stack

**Environment:**  
[Node.js](https://nodejs.org/en/) with [pnpm](https://pnpm.io/) package manager

**Language:**  
[TypeScript](https://www.typescriptlang.org/)

**Core Libraries:**  
[React](https://react.dev/) – UI library  
[Next.js](https://nextjs.org/) – application framework  
[Clerk](https://clerk.com/docs/quickstarts/nextjs) – authentication  
[Supabase JS](https://supabase.com/docs/reference/javascript/introduction) – data access client  
[TanStack Query](https://tanstack.com/query/latest) – server-state management  
[Zustand](https://zustand.docs.pmnd.rs/) – client-state management  
[next-intl](https://next-intl.dev/) – internationalization  
[React Hook Form](https://react-hook-form.com/) – forms  
[Zod](https://zod.dev/) – schema validation  
[date-fns](https://date-fns.org/) – date utilities  
[Recharts](https://recharts.org/) – charting  
[react-aria-components](https://react-spectrum.adobe.com/react-aria/components.html) – accessible UI primitives  
[lucide-react](https://lucide.dev/) – icons  
[class-variance-authority](https://cva.style/docs) + [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) – utility-first component styling composition

**Styling:**  
[Tailwind](https://tailwindcss.com/) – utility-first CSS framework

**Testing:**  
[Vitest](https://vitest.dev/) – testing framework

**Linting & Formatting:**  
[Biome](https://biomejs.dev/) – JavaScript, TypeScript, and JSON linter and formatter

[:arrow_up: Back to top][toc]

## Security Guidelines

Security is a shared responsibility. Every engineer is expected to follow best practices and be proactive in identifying and mitigating potential security risks in our applications.

Our security principles are based on industry standards and are regularly updated to keep pace with evolving threats. All engineers must familiarize themselves with the latest [OWASP Top Ten](https://owasp.org/www-project-top-ten/), which provides a comprehensive overview of the most critical security risks. It is essential to not only understand these risks but also to take action to prevent them during development.

For in-depth guidelines, consult [OWASP](https://owasp.org/www-project-developer-guide/), and always prioritize security in your development process. Discuss security concerns with your team during code reviews or discussions when in doubt.

[:arrow_up: Back to top][toc]

## Feature Delivery Workflow

1. Create a feature branch off `master`
2. Implement the feature
3. Create a pull request from the feature branch to `master`
4. Assign and ping code reviewers
5. Share the link to the feature on preview deployment to your domain's channel and ping the feature's stakeholders
6. Address feedback and receive approval
7. Merge the pull request (through "Squash and merge" option❗️)
8. Validate the feature on production

[:arrow_up: Back to top][toc]

## Source Control (Git)

### Development Model

We follow trunk-based development - a source-control branching model where developers collaborate on code in a single branch called 'trunk' (in our case, `master`). The key principle is keeping `master` in a deployable state at all times, with developers integrating their changes frequently. For more details, see [trunkbaseddevelopment.com](https://trunkbaseddevelopment.com/).

### Branches

Our project have the following default branches:

- `main` – production branch

Branch off `main` and name your branch by prefixing it with the type, followed by a brief description in `kebab-case`.

```
feat/add-sample-report-page
^--^ ^-------------------^
 |          |
 |          +-> short description (kebab-case)
 +-------------> type
```

Branch types:

- `feat/` – implementing a feature
- `fix/` – fixing a bug
- `refactor/` – refactoring
- `test/` – adding missing tests, refactoring tests
- `docs/` – updating documentation
- `chore/` – updating tools, build scripts etc.
- `release/` – releasing a specific set of commits
- `hotfix/` – releasing a hotfix

### Pull Requests

Pull request titles must follow this pattern:

```
project(s): Description
^-------^ ^----------^
    |          |
    |          +-> short description of changes
    +------------> project name(s), slash-separated (/) if multiple
```

Examples:

- `web-app: Update homepage hero`
- `web-app/report-viewer/tailwind-config: Update design system colors`

This format ensures consistency and is automatically validated by our CI pipeline. Once validated, GitHub labels will be automatically assigned based on the project names.

### Commit messages

Commit messages should:

1. Be capitalized
2. Use the imperative mood
3. Be limited to 72 characters
4. Not end with a period

Imperative mood means "spoken or written as if giving a command or instruction", like "close the door" or "take out the trash". Git itself uses the imperative whenever it creates a commit on your behalf:

```
* Merge pull request #123 from feat/branch
* Revert "Run pricing experiment"
```

A properly formed Git commit message should always be able to complete "_If applied, this commit will `your commit message`_" sentence:

> If applied, this commit will `refactor component X for readability`  
> If applied, this commit will `update getting started documentation`  
> If applied, this commit will `remove deprecated methods`  
> If applied, this commit will `release version 1.0.0`  
> If applied, this commit will `merge pull request #123 from feat/sample-branch`

Notice how this doesn't work for the other non-imperative forms:

> If applied, this commit will ~fixed bug with Y~  
> If applied, this commit will ~changing behavior of X~  
> If applied, this commit will ~more fixes for broken stuff~  
> If applied, this commit will ~sweet new API methods~

The rules are based on a great article by [**@cbeams**](https://github.com/cbeams): [How to Write a Git Commit Message](https://cbea.ms/git-commit/)

[:arrow_up: Back to top][toc]

## Coding Style & Conventions

You'll notice that the list of conventions is rather small. **Our general philosophy is to delegate enforcing conventions to tools.** Machines should do the heavy lifting so that humans can focus on what matters. That way, we don't have to memorize and correctly use an extensive list of rules. And more importantly, this improves code reviews – the reviewers can concentrate on code quality, maintainability, correctness, and knowledge transfer instead of commenting on code style and conventions.

⚠️ **Before adding another convention, consider if it can be enforced through a linter rule.** If there is no existing rule that we can configure for our use case, implementing a custom rule is also an option.

⚠️ Our conventions are loosely inspired by [Airbnb/Javascript](https://github.com/airbnb/javascript) and [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react#airbnb-reactjsx-style-guide), and enforced by [Biome](https://biomejs.dev/) (see `biome.jsonc`). **Please read those before reading our conventions (or adding new ones)**.

### File Structure

#### Prefer Module-Based Structure

> **Why**?
>
> **Separation of Concerns**: Each module encapsulates a specific functionality or feature, making the code easier to understand and maintain.
>
> **Code Reusability**: Common functionalities can be abstracted into shared modules, promoting code reusability.
>
> **Scalability**: As the application grows, new modules can be added without affecting existing ones, making the codebase more scalable.

```bash
└── src/
    ├── modules/
    │   ├── auth/
    │   ├── payments/
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   │   ├── index.ts
    │   │   │   ├── useOrderStatusQuery.ts
    │   │   │   ├── useCheckout.ts
    │   │   ├── constants.ts
    │   │   ├── utils.ts
    │   │   ├── api.ts // Api should be co-located with module too
    │   │   ├── assets/
    │   │   │   ├── logo.svg
    │   ├── shared/
    │   │   ├── components/
    │   │   │   ├── Button.tsx
    │   │   │   ├── Input.tsx
    │   │   │   ├── index.ts
    │   │   ├── constants/
    │   │   ├── hooks/
    │   │   ├── utils/
    └── pages/
        ├── home.tsx
        └── settings.tsx
```

#### Avoid prefixing inner module files

> **Why**?
>
> **Scalability**: Allows easy transition to a folder with an `index` file when file expands.
>
> **Less Repetition**: Avoids redundant module name repetition, as both IDE search and imports already provide this context.

```bash
  ├── module
  │   ├── payments
  │   │   ├── api.ts // ✅ good
  │   │   ├── payments.api.ts // ⛔️ bad
  └───├── ....
```

#### Keep state files (Queries, Mutations, UI State) in `/hooks` and use suffixes

> **Why**?
>
> **Clarity**. Avoid from exposing raw state or query hooks directly. Instead, create meaningful hooks that encapsulate these implementation details.
>
> As the codebase expands, create private hooks with suffixes to better indicate their purpose:
>
> - use\*Store - for store
> - use\*Query - for queries
> - use\*Mutation - only when the hook **returns** the `useMutation` result as its API (e.g. `return useMutation({..`); otherwise use a domain hook name (e.g. `useCheckout`).

Usually, these hooks aren't in the `index` file, as they're part of larger, more meaningful hooks.

```bash
├── modules
  │   ├── payments
  │   │   ├── hooks
  │   │   │   ├── useOrderStatusQuery.ts // data fetching
  │   │   │   ├── useRevokeOrderMutation .ts // mutation
  │   │   │   ├── usePaymentDetailsStore.ts // store
  │   │   │   ├── useCheckout.ts // just hook
  │   │   │   ├── index.ts // all hook exports
  └───├── ....
```

#### Separate ZOD schemas and types in a module

> **Why**?
>
> **Ease of Use**: It's easier to find and update models, types, or schemas when they're in their own dedicated files.
>
> But don't separate models and types, keep them under the `types.ts` file.

```bash
  ├── modules
  │   ├── user
  │   │   ├── schemas.ts
  │   │   ├── types.ts
  └───├── ....
```

### JavaScript

#### Do not use single-letter variable names

Explicit is better for readability than implicit.

- [ ] Enforce through a linter rule (no equivalent rule exists in Biome yet)

```js
// ⛔️ bad:
const expand = (e) => {
  e.preventDefault();
  // <…>
};

// ✅ good:
const expand = (event) => {
  event.preventDefault();
  // <…>
};
```

```js
// ⛔️ bad:
reports.forEach((r, i) => {
  const previousReport = reports[i - 1];
  // <…>
});

// ✅ good:
reports.forEach((report, index) => {
  const previousReport = reports[index - 1];
  // <…>
});
```

#### Avoid boolean prefixes, prefer adjective form

Prefixing boolean variable names with "is" or "has" adds unnecessary noise without making them any clearer when adjective form is used correctly. "Active" already implies that it holds a yes/no value, calling it "is active" does not make it any clearer.

```js
// ⛔️ bad:
const isActive = true;
const isLarge = false;
const isCurrent = true;
const isSelected = false;
const hasBorder = false;

// ✅ good:
const active = true;
const large = false;
const current = true;
const selected = false;
const bordered = false;
const hasFooter = true; // using a prefix is ok when there's no good adjective form ("footered"? 🥴)
const open = true; // "open" as an adjective, not a verb
```

A present continuous verb can also be used to signify an ongoing process:

```js
// ⛔️ bad:
const isCreating = true;
const isDeleting = false;

// ✅ good:
const creating = true;
const deleting = false;
```

When the variable name includes a noun, it should go first:

```js
// ⛔️ bad:
if (visibleModal) {
  // does not read naturally: "if [is] visible modal, do something"
  // <…>
}

// ✅ good:
// noun + adjective
if (modalVisible) {
  // reads naturally: "if modal [is] visible, do something"
  // <…>
}
```

Prefixing _functions_ with "is" or "has" does make sense. Functions create a level of indirection, you're calling one to initiate an action or ask a question about something: _Is disabled? Yes._ While a property is just a trait of an object: a box is _bordered_, _selected_, _large_.

```js
// ✅ good:
const disabled = isDisabled();
```

[:arrow_up: Back to top][toc]

### TypeScript

TODO

[:arrow_up: Back to top][toc]

### React

#### Component naming: Use shortest possible names that gives enough context

Avoid too generic component names, especially that are already (or can be) used by reusable components (E.g: `Icon`, `Dropdown`, `Nav`, ...). But also, don't over-prefix everything, as it's repetitive and unnecessary.

      ```bash
      ├── components
      │   ├── Icon
      │   │   ├── Icon.js
      │   │   ├── index.js
      │   ├── Button
      │   │   ├── Button.js
      │   │   ├── Icon.js  // ⛔️ bad, Icon is too generic and exists as common component
      │   │   ├── ButtonIcon.js  // ✅ good, prefixing works well to give the context
      │   │   ├── index.js
      ├── HomePage
      │   │   ├── CarAdPage.js
      │   │   ├── CarAdPageRecentCarsSection.js  // ⛔️ bad, prefixing is repetitive and unnecessary (component is already specific enough)
      │   │   ├── RecentCarsSection.js  // ✅ good - specific enough
      │   │   ├── index.js
      ├── CarAdPage
      │   │   ├── CarAdPage.js
      │   │   ├── CarAdPageAboutSection.js  // ⛔️ bad, again: repetitive & unnecessary
      │   │   ├── AboutSection.js  // ⛔️ bad (though, not critical), still a bit too generic
      │   │   ├── AboutCarSection.js  // ✅ good
      │   │   ├── index.js
      └───├── ....
      ```

#### Prefer adding newlines between JSX blocks

- Newlines add better readability as they visually separate JSX blocks.

- [ ] Enforce through a linter rule (no equivalent rule available in Biome yet)

```jsx
// ⛔️ bad
<Heading as="h1" variant="s" className={styles.title}>
  {spec?.vehicleName}
</Heading>
<dl className={styles.specs}>
```

✅ With space

```jsx
// ✅ good:
<Heading as="h1" variant="s" className={styles.title}>
  {spec?.vehicleName}
</Heading>

<dl className={styles.specs}>
```

#### Extract `queryKey` from **hook** files suffixed with query

> **Why?**
>
> **Consistency**: Allows to reuse query keys in other hooks, reducing the risk of errors due copy-pasting.
>
> Simplifies a particular query mutation or invalidating process.
>
> Anti-pattern is manually writing the key in other place.

```ts
// ⛔️ bad
const useReportsData = () => useQuery({ queryKey: 'queryKey', queryFn: fetchReports });

// `queryKey` is not exported
export { useReportsData };

// Same `queryKey` name in other useQuery definition
const usePaymentsData = () => useQuery({ queryKey: 'queryKey', queryFn: fetchPayments });

export { usePaymentsData };
```

```ts
// ✅ good:
const reportsQueryKey = ['reports'];

const useReportsDataQuery = () => useQuery({ queryKey: reportsQueryKey, queryFn: fetchReports });

export { reportsQueryKey, useReportsDataQuery };
```

#### Use `react-query` to avoid async operations in hooks and components

> **Why?**
>
> **Error Handling**: Provides built-in error handling mechanisms.
>
> **Loading State Management**: Automatically manages the loading state, reducing the need for manual management.
>
> **Success and Error Callbacks**: It allows defining `onSuccess` and `onError` callbacks, making it easier to handle side effects.
>
> **Code Readability**: Improves code readability. Reduces complexity of an async effects - [**comment**](https://github.com/facebook/react/issues/14326#issuecomment-441680293).

```ts
// ⛔️ bad:
useEffect(() => {
  let didCancel = false;

  const getPurchaseId = async () => {
    setLoading(true);
    try {
      const id = await validateReceipt(receipt);
      if (!didCancel) {
        setPurchaseId(id);
      }
    } catch (error) {
      Sentry.Native.captureException(error);
    } finally {
      setLoading(false);
    }
  };

  getPurchaseId();

  return () => {
    didCancel = true;
  };
}, [receipt]);
```

```js
// ✅ good:
const { mutate, isLoading } = useMutation({
  queryFn: validateReceipt,
  onSuccess: setPurchaseId,
  onError: Sentry.Native.captureException,
});
```

#### ZOD schema structure

There can be multiple use cases of how we use ZOD schemas: form validation, API response validation, custom error messages, etc. It's important to keep the schema structure consistent and easy to understand.

#### Use constants to define ZOD schemas when possible

This is the most simple and straightforward way to define ZOD schemas when the data is static.

```ts
const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});
```

#### Use functions to define ZOD schemas when there is dynamic data

There are cases when a schema is generated based on some dynamic data. In this case, it's better to use a function to define the schema.

```ts
const getSchema = (userType: 'individual' | 'company') =>
  z.object({
    email: z.string(),
    firstName: z.string().optional().nullable(),
    lastName: z.string().optional().nullable(),
    ...(userType === 'company' && {
      companyName: z.string(),
    }),
  });
```

#### Use hooks to define ZOD schemas when you need access to React state or use other hooks

There are cases where the schema structure relies on data from other hooks. Custom error messages are commonly used, and a more efficient approach is to translate these messages immediately and pass the translated text directly to the schema. This eliminates the need to pass an error message key and extract the translation within the component.

```ts
const useGetSchema = ({ lastOdometerRecord }: UseGetSchemaProps) => {
  const { t } = useTranslation('maintenanceSection');
  const { formatMileage } = useMeasurementFormat();

  const minMileage = {
    value: lastOdometerRecord.value + 1,
    unit: lastOdometerRecord.unit,
  };

  return z.object({
    mileage: z.number().min(minMileage.value, {
      message: t('formError.minMileage', { mileage: formatMileage(minMileage) }),
    }),
  });
};
```

[:arrow_up: Back to top][toc]

### CSS

#### Nest modifiers inside elements, avoid separate modifier blocks for targeting elements

- By creating modifier blocks, you must repeat element classes in each modifier.
- Modifier is used to modify existing element class, it has no value to be a separate block, until you need greater specificity.

```scss
/* ⛔️ bad: */
.m {
  .subtitle {
    /* <…> */
  }
}
```

```scss
/* ✅ good: */
.subtitle {
  .m & {
    /* <…> */
  }
  .l & {
    /* <…> */
  }
}
```

#### Avoid nesting modifier classes for self modification

Nested modifier class have higher specificity, which makes overriding more difficult.

```scss
/* ⛔️ bad: */
.root {
  &.highlighted {
    /* <…> */
  }
}
```

```scss
/* ✅ good: */
.root {
  /* <…> */
}

.highlighted {
  /* <…> */
}
```

#### Avoid fixed sizes, prefer baseline values via `theme.size`

Agreed with the designers, as those fixed sizes also follow an `8px` baseline on their end.  
This makes it consistent and leaves less room for interpretation.

```css
/* ⛔️ bad: */
.popup {
  width: 420px;
}
```

```css
/* ✅ good: */
.popup {
  width: theme.size(52.5);
}
```

#### CSS & SASS variables use cases

TODO

[:arrow_up: Back to top][toc]

## Testing

#### Prioritize Testing User Behavior Over Implementation

> **Why**?  
> Our users interact with and care about the UI behavior, not the code underneath. We should test our components the same way.
>
> When we base our tests on implementation specifics, they can frequently break during code refactoring, even if the user experience remains consistent.
>
> This creates extra maintenance work.

```js
// ⛔️ bad:
const wrapper = shallow(<Slider />);

wrapper.find('button').simulate('click');

// Checking internal state directly is an implementation detail
expect(wrapper.instance().status.activeIndex).to.equal(2);

// ✅ good:
render(<Slider />);

// Access elements in a way similar to how users find them
const nextBtn = screen.getByRole('button', { name: 'Go to next slide' });

fireEvent.click(nextBtn);

// Assertions should focus on observable changes, like content that the user would see
expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Slide 3 of 3');
```

#### Prefer testing top level components (usually pages or screens) rather than internal components

> **Why**?  
> There's no necessity to test components in isolation if they aren't used elsewhere.
>
> The specific layout of internal components should be seen as behind-the-scenes details.

`Exception`. If a test for a top-level component becomes extensive or challenging to navigate, it's advisable to break it down, typically by focusing on distinct sections of the page.

```bash
  ├── HomePage
  │   ├── HomePage.tsx
  │   ├── HomePage.test.tsx // ✅ good
  │   ├── HeroSection
  │   │   ├── HeroSection.tsx
  │   │   ├── HeroSection.test.tsx // ⛔️ bad. It's a part of HomePage, not reused anywhere else, no need to test it
  └───├── ....
```

#### Group Related Assertions in One `it` Block

> **Why**?  
> Multiple assertions in one `it` block aren't an issue.
>
> By grouping related assertions, we boost test readability and speed (since the component renders just once).
>
> This way, tests remain self-contained without needing to share mutable variables between them.

```js
// ⛔️ bad:
it('should render the card title', () => {
  expect(screen.getByText(title)).toBeInTheDocument();
});

it('should render the card description', () => {
  expect(screen.getByText(description)).toBeInTheDocument();
});

it('should render the card image', () => {
  expect(screen.getByRole('img')).toBeInTheDocument();
});

// ✅ good:
it('should render card title, description & image', () => {
  expect(screen.getByText(title)).toBeInTheDocument();
  expect(screen.getByText(description)).toBeInTheDocument();
  expect(screen.getByRole('img')).toBeInTheDocument();
});
```

#### Prefer using accessible queries

- Prioritize `getByRole` whenever possible.
- Reserve `getByTestId` for situations where other selectors won't work. Remember to choose from the [priority order](https://testing-library.com/docs/queries/about/#priority) where applicable.
- Useful tooling:
  1. [Testing Playground Tool](https://testing-playground.com/).
  2. Utilize the [Chrome extension](https://chrome.google.com/webstore/detail/testing-playground/hejbmebodbijjdhflfknehhcgaklhano) for the testing playground to enhance your testing workflow.

> **Why**?  
> By focusing on accessible queries, we can keep our components tidy, avoiding unnecessary data attributes solely for testing purposes.
>
> Following the [Guiding Principles](https://testing-library.com/docs/guiding-principles), it's crucial to model our tests on actual user interactions.
>
> This not only ensures accessibility, semantics but also verifies that our components work as the end user expects.

```js
// ⛔️ bad:
screen.getByTestId('username');

// ✅ good:
screen.getByRole('textbox', { name: 'username' });
```

#### Prioritize Real Services Over Mocks

> **Why**?  
> Using real services ensures our tests cover the whole flow and are not dependent on external factors like network delays.

```js
// ⛔️ bad:
// Instead of mocking, integrate external libs as providers in tests
jest.spyOn(118next, 'useTranslation').mockReturnValue({
  t: (val) => val,
  i18n: { exists: () => true }
})

// ✅ good:
// Don't mock external lib, use it directly as provider in your tests
render(
  <I18nextProvider i18n={myConfig}>
    <MyComponent />
  </I18nextProvider>
)
```

#### Use `it.each` tables for repetitive use cases

> **Why**?  
> Less repetitive code.
>
> **Improved Readability**: With `it.each`, the shared logic is centralized, making it easier to understand the variations among the test cases.
>
> **Easier Maintenance**: When test logic needs updating, you only have to make changes in one place, reducing the risk of inconsistencies.

```js
// ⛔️ bad:
expect(formatCountryName('DE')).toEqual('Germany');
expect(formatCountryName('LT')).toEqual('Lithuania');
expect(formatCountryName('US')).toEqual('United States');

// ✅ good:
it.each`
  countryCode | output
  ${'DE'}     | ${'Germany'}
  ${'LT'}     | ${'Lithuania'}
  ${'US'}     | ${'United States'}
`('formats `$countryCode` country code to `$output`', ({ countryCode, output }) => {
  expect(formatCountryName(countryCode)).toEqual(output);
});
```

#### Avoid using translation keys, prefer default translation strings

> **Why**?  
> Translation keys are for implementation, not for users. We need to focus on what users actually see to ensure accurate translations.
>
> When your strings contain variables, tests can ensure they are correctly replaced with the expected output.
>
> **Frequent concern**:
>
> Q: But my test will fail if the text changes?
>
> A: Yes, but that's normal, because text is a requirement change, and when you change requirements, you have to update tests

**Note**: `i18n` provider should be set by setting up test utils. Otherwise it wouldn't work.

```js
// ⛔️ bad:
expect(screen.queryByRole('heading', { name: 'about.translation.key' })).toBeInTheDocument();

// ✅ good:
expect(screen.queryByRole('heading', { name: 'About' })).toBeInTheDocument();
```

#### Function names should be descriptive

> **Why**?  
> Readability: Clear and descriptive naming makes the function's intent immediately obvious, improving the overall readability of the code.
>
> Reusability: Decoupling methods from specific events allows them to be used across different contexts, enhancing their versatility and reducing redundancy.
>
> Maintainability: Consistent naming conventions across the codebase make it easier for developers to understand and extend the code without extra cognitive load.
>
> Only fallback to less descriptive names (e.g. `handleClick = ...`) if absolutely necessary and there's no better alternative.

```js
// ⛔️ bad:
const onClick = () => {
  // <…>
};

// ➕/➖ better, but still not ideal:
const handleClick = () => {
  // <…>
};

// ✅ good:
const submitForm = () => {
  // <…>
};
```

If the event handler directly receives an event object (e.g., from `onScroll`), use the `handle` prefix for the function name.

```js
// ✅ good:
const handleScroll = (event) => {
  // <…>
};
```

#### Use logical expressions for cn conditions

[Prerequisites](https://github.com/dcastil/tailwind-merge/discussions/137#discussioncomment-3481605)

> **Why**?  
> Readability: Logical expressions place the condition before the class string, making it easier to understand whether the condition is relevant without needing to jump back and forth between conditions and class strings.
>
> Consistency: All class strings, regardless of length or complexity, are styled uniformly in editors, ensuring better visual clarity and reducing the chance of missing important classes.
>
> Efficiency: Logical expressions eliminate the need to scan through long class strings in an object, reducing cognitive overhead when analyzing or debugging code.
>
> Debugging: Debugging becomes more straightforward since conditions and their associated classes are directly linked, making it faster to identify and modify specific states.

```jsx
// ⛔️ bad:
<div
  className={cn('w-full', {
    'bg-dark': darkMode,
    'tracking-wider': trackingWider,
  })}
/>

// ✅ good:
<div
  className={cn('w-full',
    darkMode && 'bg-dark',
    trackingWider && 'tracking-wider'
  )}
/>
```

#### Do not use React.PropsWithChildren

> **Why**?  
> Explicitness: Declaring `children` explicitly as `React.ReactNode` in the `Props` type makes it clear that the component accepts `children`. This improves readability and avoids hidden or implied behavior from `React.PropsWithChildren`.
>
> Flexibility: `React.PropsWithChildren` enforces the presence of `children` (defaulting to `ReactNode | undefined`), even if `children` are not required. By explicitly defining `children`, you can easily mark it as required or optional, depending on the component's needs.

```ts
// ⛔️ bad:
type Props = React.PropsWithChildren & {
  title: string;
};

// ✅ good:
type Props = {
  children: React.ReactNode;
  title: string;
};
```

#### Avoid using returnObjects: true unless translating arrays

> When working with `i18next` or `next-i18next`, avoid using the option `returnObjects: true` unless the translation key explicitly references an array. Using `returnObjects: true` on non-array structures can lead to unexpected results, type errors, and harder-to-maintain code.

```ts
// ⛔️ bad:

"activity": {
  "deregister": {
    "description": "Description",
    "title": "Title"
  },
  "export": {
    "description": "Description",
    "title": "Title"
  }
}

function useTranslationObject(event) {
  const { t } = useTranslation('timelineSection');

  return t(`activity.${event.type}`, { returnObjects: true });
}

const { title, description } = useTranslationObject(event)
```

```ts
// ✅ good:

"activities": [
  "deregister",
  "export",
  "import"
]

const activities = t('activities', {
  returnObjects: true,
});

<ul>
  {activities.map((activity) => (
    <li key={activity} className="text-m">
      {activity}
    </li>
  ))}
</ul>
```

### Resources

To get more detailed info, check our [Notion | Unit & Integration test](https://www.notion.so/Knowledge-Sharing-Sessions-3fbe16c784394cf48dc8cdfc61984e01?p=3580151080aa4642bfbac6983e7bd821&pm=s) article.

[:arrow_up: Back to top][toc]

## Continuous Integration & Deployment

TODO

[:arrow_up: Back to top][toc]

## Continuous Learning

As software engineers, it's key to stay current and relevant within the technologies and the domains we work. Frontend changes rapidly and although it's impossible to stay up to speed with absolutely everything, this guide should give you an idea what technologies you could focus on. We've compiled a list of [frontend resources in the team wiki](https://www.notion.so/Frontend-Resources-4dfd8f6872644d1ab99c274307228a68) and you can also study [courses on Frontend Masters](https://frontendmasters.com/) through your company account.

[:arrow_up: Back to top][toc]

[toc]: #table-of-contents
