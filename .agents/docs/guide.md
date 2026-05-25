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
[Node.js](https://nodejs.org/en/) 22.13+ with [pnpm](https://pnpm.io/) 11 package manager

**Language:**  
[TypeScript](https://www.typescriptlang.org/) with [`tsgo`](https://www.npmjs.com/package/@typescript/native-preview) for type checking

**Framework & Rendering:**  
[React](https://react.dev/) – UI framework for the web  
[React DOM](https://react.dev/reference/react-dom) – React renderer for the browser  
[Next.js](https://nextjs.org/) – web development framework using the App Router  
[React Compiler](https://react.dev/learn/react-compiler) – enabled through Next.js configuration  
[Turbopack](https://nextjs.org/docs/app/api-reference/turbopack) – Next.js bundler, with [`turbopack-inline-svg-loader`](https://www.npmjs.com/package/turbopack-inline-svg-loader) for small inline SVG imports

**Styling:**  
[Tailwind CSS](https://tailwindcss.com/) – utility-first CSS framework  
[`@tailwindcss/postcss`](https://www.npmjs.com/package/@tailwindcss/postcss) – Tailwind CSS PostCSS integration  
[`clsx`](https://github.com/lukeed/clsx) and [`tailwind-merge`](https://github.com/dcastil/tailwind-merge) – conditional class composition and Tailwind class conflict resolution  
[`lucide-react`](https://lucide.dev/) – icon library  
[`motion`](https://motion.dev/) – animation library  
[`react-aria-components`](https://react-spectrum.adobe.com/react-aria/index.html) – accessible UI component primitives

**Auth, Data & Forms:**  
[Clerk](https://clerk.com/docs/references/nextjs/overview) – authentication for Next.js  
[Supabase SSR](https://supabase.com/docs/guides/auth/server-side/nextjs) and [Supabase JS](https://supabase.com/docs/reference/javascript/introduction) – backend client and server-side auth helpers  
[TanStack Query](https://tanstack.com/query/latest) – client-side server state, refetching, and mutations  
[React Hook Form](https://react-hook-form.com/) – form state management  
[`@hookform/resolvers`](https://github.com/react-hook-form/resolvers) – Zod resolver integration for React Hook Form  
[Zod](https://zod.dev/) – runtime schema validation  
[date-fns](https://date-fns.org/) – date utilities

**i18n:**  
[next-intl](https://next-intl.dev/) – internationalization for Next.js

**Charts & Visualization:**  
[Recharts](https://recharts.org/) – charting components

**Testing:**  
[Vitest](https://vitest.dev/) – unit and component test runner  
[jsdom](https://github.com/jsdom/jsdom) – browser-like test environment  
[React Testing Library](https://testing-library.com/docs/react-testing-library/intro), [`@testing-library/user-event`](https://testing-library.com/docs/user-event/intro/), and [`@testing-library/jest-dom`](https://github.com/testing-library/jest-dom) – React testing utilities and DOM assertions  
[Playwright](https://playwright.dev/) – end-to-end testing framework  
[`@axe-core/playwright`](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright) – accessibility checks in Playwright tests

**Linting & Formatting:**  
[Biome](https://biomejs.dev/) – JavaScript, TypeScript, CSS, and JSON linting, formatting, import organization, and custom Grit rules

**Analytics, Monitoring & Diagnostics:**  
[Vercel Analytics](https://vercel.com/docs/analytics) – web analytics  
[Vercel Speed Insights](https://vercel.com/docs/speed-insights) – frontend performance insights  
[Sentry](https://docs.sentry.io/platforms/javascript/guides/nextjs/) – error monitoring and production release instrumentation  
[Fallow](https://www.npmjs.com/package/fallow) – dead code, dependency, and architecture diagnostics  
[React Doctor](https://www.npmjs.com/package/react-doctor) – React quality diagnostics

**Workflow:**  
[Lefthook](https://lefthook.dev/) – Git hooks

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

### Trunk-Based Development

The team collaborates on a single `main` branch kept deployable at all times. Feature branches are short-lived.

### Branch Naming

```
feat/add-sample-report-page
^--^ ^-------------------^
 |          |
 |          +-> short description (kebab-case)
 +-------------> type
```

Types: `feat/`, `fix/`, `refactor/`, `test/`, `docs/`, `chore/`, `release/`, `hotfix/`

### PR Titles

```
Scope: Description
```

Examples:

- `Analytics: Add vercel analytics`
- `Refactor: App structure, various improvements`

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
> If applied, this commit will `merge pull request #123 from feat/PROJ-123/branch`

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

#### Prefer Flat Modules-Based structure

> **Why**?
>
> **Separation of Concerns**: Each module owns one Kuvro business capability.
>
> **Colocation**: Components, hooks, API/server code, schemas, types, utilities, and assets live near the capability they support.
>
> **Scalability**: New business capabilities can be added as sibling modules without expanding vague `shared`, `common`, or `base` buckets.

```bash
└── src/
    ├── app/                  # Next.js route wrappers, metadata, layouts, server orchestration
    ├── modules/
    │   ├── workspace/
    │   ├── money/
    │   ├── spend-requests/
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   │   ├── useSpendRequestsQuery.ts
    │   │   │   └── useApproveSpendRequestMutation.ts
    │   │   ├── api.ts
    │   │   ├── server.ts
    │   │   ├── schemas.ts
    │   │   ├── types.ts
    │   │   ├── utils.ts
    │   │   ├── assets/
    │   │   │   ├── logo.svg
    │   ├── invoices/
    │   ├── vendors/
    │   ├── dashboard/
    │   ├── marketing/
    │   └── page-shell/
    ├── ui/                   # Generic design-system primitives
    ├── services/             # Technical integrations and platform adapters
    ├── utilities/            # Domain-agnostic helpers
    └── test/
```

Business modules should not import other business modules by default. Compose multiple modules in `src/app`, or extract a shared business primitive into its own module, such as `modules/money`.

Keep support layers outside `modules`:

- `ui` for generic UI primitives.
- `services` for Clerk, Supabase, Sentry, env, i18n, and query providers.
- `utilities` for helpers with no Kuvro business meaning.

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

#### Count user-visible characters with `Intl.Segmenter`

Use grapheme clusters for user-facing character counts, text limits, and counters. JavaScript's `.length` counts UTF-16 code units, so emoji sequences, flags, skin-tone modifiers, and many non-Latin scripts can be counted as multiple characters even when users see one.

Use the shared `countCharacters` utility from `utilities/text/countCharacters` instead of inlining `Intl.Segmenter`. MDN reference: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter

```ts
// ⛔️ bad: counts UTF-16 code units
const characterCount = value.length;

// ⛔️ better, but still splits zero-width-joiner emoji sequences
const characterCount = Array.from(value).length;

// ✅ good: counts user-visible characters
const characterCount = countCharacters(value);
```

Use `granularity: "word"` for user-facing word counts in languages without space-delimited words. Do not use grapheme counts for database byte limits, ASCII-only protocols, or backend validation that explicitly enforces UTF-8 bytes or another storage-specific definition.

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

#### Use `AbortController` for cancellation — not just `fetch()`

One controller can cancel multiple async operations and event listeners at once. Pass `{ signal: ctrl.signal }` to any async operation, call `ctrl.abort()` to cancel everything.

```js
// ⛔️ bad: manual cleanup, no timeout, listeners leak
el.addEventListener('click', handler);
el.addEventListener('keydown', handler);

const res = await fetch('/api/slow');

el.removeEventListener('click', handler);
el.removeEventListener('keydown', handler);

// ✅ good: one controller, one abort, everything cleaned up
const ctrl = new AbortController();

element.addEventListener('click', handler, { signal: ctrl.signal });
element.addEventListener('keydown', handler, { signal: ctrl.signal });

const res = await fetch('/api/slow', {
  signal: AbortSignal.timeout(5_000), // built-in timeout, no setTimeout needed
});

ctrl.abort(); // removes all listeners, cancels pending operations
```

#### Use `structuredClone()` for deep copying objects

`JSON.parse(JSON.stringify())` silently corrupts `Date`, `Map`, `Set`, and `undefined` values, and throws on circular references. `structuredClone()` is the native alternative that handles all of these correctly.

```js
// ⛔️ bad: silent data corruption
const copy = JSON.parse(JSON.stringify(original));
// copy.date       → string, not Date
// copy.items      → {}, not Set
// copy.metadata   → {}, not Map
// copy.config     → {}, undefined is dropped
// circular refs   → throws

// ✅ good: preserves all types correctly
const copy = structuredClone(original);
// copy.date       → Date ✅
// copy.items      → Set {1, 2, 3} ✅
// copy.metadata   → Map {'key' → 'value'} ✅
// copy.config     → { debug: undefined } ✅
// circular refs   → handled ✅
```

> `structuredClone()` cannot clone functions, DOM nodes, class methods, or symbols — use `lodash.cloneDeep` only if those are required.

#### Use `Promise.withResolvers()` instead of hoisting resolve/reject

Whenever you need to resolve a promise from outside its constructor, the old pattern requires declaring variables before the `new Promise()` call. `Promise.withResolvers()` eliminates that boilerplate entirely.

```js
// ⛔️ bad: three variables, callback exists only to hoist resolve/reject
let resolve, reject;
const promise = new Promise((res, rej) => {
  resolve = res;
  reject = rej;
});
element.addEventListener('click', resolve, { once: true });

// ✅ good: one line, destructured, no ceremony
const { promise, resolve, reject } = Promise.withResolvers();
element.addEventListener('click', resolve, { once: true });
```

#### Use `crypto.randomUUID()` instead of the `uuid` package

`crypto.randomUUID()` is built into the browser and Node.js 18+. It generates RFC 4122 compliant, cryptographically random UUIDs with no dependencies.

- [ ] No Biome rule available — enforce through code review

```js
// ⛔️ bad: unnecessary dependency
import { v4 as uuid } from 'uuid';
const id = uuid();

// ✅ good: native, no import needed
const id = crypto.randomUUID();
```

#### Use native `fetch()` instead of `axios` or `node-fetch` for simple requests

`fetch()` is native in all modern browsers and Node.js 18+. For straightforward GET/POST requests it needs no wrapper.

```js
// ⛔️ bad: unnecessary dependency for a simple request
import axios from 'axios';
const { data } = await axios.get('/api/users');

// ✅ good: native fetch, available everywhere
const data = await fetch('/api/users').then(r => r.json());
```

> Keep `axios` when you need interceptors, automatic retries, request cancellation across many call sites, or need to support environments without native `fetch`.

### JavaScript

#### Use `Object.groupBy()` instead of `reduce` for grouping

Hand-rolled `reduce` grouping requires an accumulator, a mutation, and a `return acc` that silently breaks everything if forgotten. `Object.groupBy()` reads like the problem statement.

- [ ] No Biome rule available — enforce through code review

```js
// ⛔️ bad: verbose, error-prone, mutates inside a "functional" method
const grouped = items.reduce((acc, item) => {
  (acc[item.category] ??= []).push(item);
  return acc;
}, {});

// ✅ good: one line, no accumulator, no mutation
const grouped = Object.groupBy(items, item => item.category);
```

> Use `Map.groupBy()` when keys are non-string types (objects, dates, reference types) — same API, returns a `Map` instead of a plain object.
> 
> Keep `reduce` for performance-critical paths processing 100K+ items, or when the grouping callback also filters, transforms, or deduplicates in the same pass.

[:arrow_up: Back to top][toc]

### TypeScript

#### Use discriminated unions for mutually exclusive states

When fields are only valid in specific combinations, model the valid states explicitly with a discriminant instead of optional properties.

This prevents impossible states from being represented and gives TypeScript enough information to narrow safely after a status check.

```ts
// ⛔️ bad: loading, dataset, and message can be combined in invalid ways
type WorkspaceDatasetLoadResult = {
  dataset?: FinancialDataset;
  loading?: boolean;
  message?: string;
};

// ✅ good: each state has exactly the fields it needs
type WorkspaceDatasetLoadResult =
  | {
      status: "loading";
    }
  | {
      dataset: FinancialDataset;
      status: "success";
    }
  | {
      message: string;
      status: "forbidden" | "unauthenticated" | "unavailable";
    };
```

Use this for async state, multi-step flows, mutually exclusive UI modes, and domain results where one field determines which other fields exist.

Don't use this for independent config fields, simple on/off booleans, or React Query results that already provide a typed status shape.

#### Prefer `as const satisfies` for static runtime constants

Use `as const satisfies Type` for static object and array constants when you want both literal inference and shape validation. This is especially useful for value maps, route/content lists, lookup tables, config-like objects, and static UI copy that is read at runtime.

```ts
type ActionPriority = "critical" | "high" | "medium" | "low";

// ⛔️ bad: validates the shape, but widens the literal values and keys.
const ACTION_PRIORITY_WEIGHTS: Record<ActionPriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

// ✅ good: preserves literals and validates the required shape.
const ACTION_PRIORITY_WEIGHTS = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
} as const satisfies Record<ActionPriority, number>;
```

`as const` alone narrows literals but does not prove the object matches the intended broader contract. A type annotation validates the contract but can erase useful autocomplete by widening keys and values. `as const satisfies Type` gives both without an intermediate variable.

Prefer object literals with `as const satisfies` over frontend `enum` declarations for static value maps. `enum` emits a runtime wrapper, while a plain object stays regular JavaScript. Use `const enum` only in controlled toolchains where the build setup is known to preserve the intended inlining behavior.

Do not force `as const` onto data that intentionally flows through mutable framework or domain contracts. If adding `as const` turns a broad domain model into readonly arrays or readonly nested objects, update the domain contract deliberately or leave the object mutable.

#### Type property ordering: required first, optional second

Put required properties before optional properties. Within each group, order properties alphabetically.

This makes component contracts easier to scan: the required shape is visible first, and optional customization sits below it.

```ts
// ⛔️ bad:
type PanelProps = {
  as?: "article" | "div" | "section";
  className?: string;
  children: React.ReactNode;
  variant?: "accent" | "glass" | "light";
};

// ✅ good:
type PanelProps = {
  children: React.ReactNode;
  as?: "article" | "div" | "section";
  className?: string;
  variant?: "accent" | "glass" | "light";
};
```

#### Prefer `T[]` for arrays

Use `T[]` instead of `Array<T>` for arrays. For object shapes used more than once, extract a named type.

This keeps simple array types compact and makes reusable object shapes part of the module vocabulary.

```ts
// ⛔️ bad:
const roleOptions: Array<{
  label: string;
  value: CompanyRole;
}> = [];

// ✅ good, inline for one-off object shapes:
const roleOptions: { label: string; value: CompanyRole }[] = [];

// ✅ good, extracted when reused or meaningful:
type RoleOption = {
  label: string;
  value: CompanyRole;
};

const roleOptions: RoleOption[] = [];
```

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

#### Choose the right React 19 data and mutation primitive

Kuvro is server-first by default. Use React 19 primitives where they remove state plumbing without weakening validation, authorization, or module ownership.

| Need | Prefer | Notes |
| --- | --- | --- |
| Initial workspace/page data | Server Components and route-level loading | Default for App Router pages. Keep client leaves interactive, not responsible for first load. |
| Client refetching, cache, polling, or long-lived server state | TanStack Query | Export query keys from query hooks so mutations can invalidate consistently. |
| Instant user feedback over confirmed server state | `useOptimistic` | Good for approve/reject, save, follow, add-to-list, and similar user-triggered mutations. Server still validates and authorizes. |

Use `useOptimistic` when the user should see the likely result immediately while the server mutation is in flight. Put the optimistic update inside `startTransition` when the action is async so React can show the optimistic render before awaiting network/server work.

```tsx
const [optimisticRequests, addOptimisticDecision] = useOptimistic(
  requests,
  (currentRequests, decision: Decision) =>
    currentRequests.map((request) =>
      request.id === decision.id ? { ...request, status: decision.status } : request,
    ),
);

const decideRequest = (decision: Decision) => {
  startTransition(async () => {
    addOptimisticDecision(decision);

    const result = await decideSpendRequestAction(decision);

    if (result.status === "error") {
      showError(result.message);
    }
  });
};
```

Do not use optimistic UI to bypass permissions, schema checks, CSRF protection, or server-side conflict handling. Treat it as a temporary UI projection over confirmed server state.

Use `<Activity>` when the user is likely to return to hidden UI and local/DOM state should survive, such as stateful tabs, drawers, filters, or review panels. Hidden Activity subtrees keep state and DOM, pause Effects, and still re-render at lower priority when props change. Avoid wrapping large trees that are unlikely to become visible again.

Use `useEffectEvent` only for event-like callbacks fired from Effects that need the latest props or state without restarting the subscription. It is not a generic way to silence `exhaustive-deps`.

Use React's `use` for conditional context reads or framework/cached promises. Do not create uncached promises during client render.

Use React DOM resource APIs such as `preconnect`, `preload`, `preinit`, and `preloadModule` only for proven critical resources or anticipated navigation/module warming. Do not add speculative preloads without evidence because they can compete with current-page work.

React Compiler is enabled, so avoid defensive `useMemo` and `useCallback` by default. Add manual memoization when a stable reference is part of an API contract, preserves semantic identity, or fixes a measured performance issue.

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

#### Use `key` for intentional component resets

React uses `key` for component identity, not only list diffing. When a component's local state should be thrown away after switching to a different entity, prefer a stable identity key over effect-based prop-to-state synchronization.

```tsx
// ⛔️ bad: manual reset logic is easy to make stale
useEffect(() => {
  resetForm(user);
}, [user]);

// ✅ good: a new user identity remounts the form and resets local state
<UserForm key={user.id} user={user} />
```

Good fits include forms, modals, tabs, profile switchers, and dashboards where stale local state, subscriptions, or animations should restart for a new entity. Key by the smallest stable domain identity that should own the state, such as `user.id`, `workspace.id`, or `selectedTabId`.

Do not use keyed remounts when preserving local state is part of the experience, or when the component owns heavy work, expensive subscriptions, or a large subtree that would be costly to recreate. In those cases, keep explicit state transitions near the component that owns the behavior.

#### Prefer `:has()` over styling-only React state

When a parent style depends only on descendant structure or native element state, consider CSS `:has()` instead of React state, event handlers, wrapper elements, or prop drilling. Use it when the selector is clearer than lifting a state class to the component root.

```tsx
// ⛔️ bad: styling-only state and handler
const [invalid, setInvalid] = useState(false);

return (
  <form className={cn(invalid && "border-warning")}>
    <input onChange={(event) => setInvalid(!event.currentTarget.validity.valid)} />
  </form>
);
```

```css
/* ✅ good: CSS handles the structural relationship */
form:has(input:invalid) {
  border-color: var(--warning);
}
```

Good fits include `form:has(input:invalid)`, `li:has(input:checked)`, `.grid:has(> :nth-child(4))`, and `article:not(:has(img))`. Keep the condition in JavaScript when explicit downward state flow is easier to read, when future readers will expect the state near the component root, or when the condition also drives behavior, data fetching, accessibility attributes, analytics, business rules, API results, feature flags, permissions, or multi-step user state.

Avoid chained, deeply nested, or broad `:has()` selectors on large or frequently mutating DOMs. Selectors such as `.card:has(.selected):has(.error)` shift state work into the CSS engine and can be more expensive to re-evaluate during DOM mutations.

#### Prefer native View Transitions before animation dependencies

Before adding `motion`, Framer Motion, GSAP, or another runtime animation dependency, check whether the browser View Transition API solves the interaction. Page-level fades, route state changes, and shared element morphs are often snapshot transitions rather than imperative animation problems.

Use native View Transitions when the browser can snapshot before and after states:

- Same-document state changes: wrap the DOM update in `document.startViewTransition(() => updateDom())`.
- Shared elements: give both states the same stable `view-transition-name`.
- Multi-page apps: use `@view-transition { navigation: auto; }` when cross-document browser support matches the product's audience.
- Custom timing and easing: style `::view-transition-*` pseudo-elements in CSS.

Keep an animation library when the interaction depends on gestures, dragging, spring physics, interruption-heavy behavior, or complex staggered choreography. These are not what View Transitions are designed to replace.

For Next.js, treat `experimental.viewTransition` as experimental until the Next.js docs say it is production-ready for the version in use. Prefer local, progressive enhancement through the browser API for isolated interactions.

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
