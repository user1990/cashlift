---
name: guide
description: Coding conventions, file structure, Git/PR/commit rules, React/Zod/React Query patterns, and i18n rules. Trigger when writing TS/React code, naming things, structuring files, creating branches/commits/PRs, or looking up team conventions.
---

# Frontend Guide
Coding style, conventions, and workflow for frontend development. For deeper rationale, historical conventions, and full process details such as feature delivery workflow, read `.agents/docs/guide.md` only when needed.

## Technology Stack

| Category   | Tools                                                  |
| ---------- | ------------------------------------------------------ |
| Runtime    | Node.js 22.13+ + pnpm 11                               |
| Language   | TypeScript + tsgo                                      |
| Frameworks | React, React DOM, Next.js, React Compiler, Turbopack   |
| Auth/Data  | Clerk, Supabase SSR, Supabase JS, TanStack Query       |
| Forms      | React Hook Form, @hookform/resolvers, Zod              |
| Styling    | Tailwind CSS v4, @tailwindcss/postcss, clsx, tailwind-merge |
| UI/Motion  | react-aria-components, lucide-react, motion            |
| i18n       | next-intl                                              |
| Charts     | Recharts                                               |
| Testing    | Vitest, jsdom, Testing Library, Playwright, axe-core Playwright |
| Linting    | Biome (lint + format + import organization)            |
| Monitoring | Sentry, Vercel Analytics, Vercel Speed Insights        |
| Diagnostics | Fallow, React Doctor                                  |
| Workflow   | Lefthook                                               |

## Security Guidelines

Security is a shared responsibility. Keep these baseline rules in mind for all feature work:

- Follow OWASP Top Ten guidance and common web security practices.
- Render user text through JSX by default. Avoid `dangerouslySetInnerHTML`; when raw HTML is unavoidable, sanitize it first with a reviewed sanitizer and keep the sink local and obvious.
- Never store auth tokens or session secrets in `localStorage` or `sessionStorage`. Use the auth provider's HttpOnly/Secure/SameSite cookie flow and keep tokens server-side.
- For cookie-authenticated state-changing requests, include and validate a CSRF token unless the endpoint is already protected by an equivalent framework/provider guarantee.
- Validate all external input at server boundaries with Zod or an equivalent schema before using it. Client-side validation is UX only.
- Authorize before data access or mutation, and scope every query to the authenticated user/workspace.
- Use parameterized queries/query builders only. Never concatenate external input into SQL or filter strings.
- Keep a restrictive CSP and browser hardening headers in place. Use nonces for inline scripts/styles in Next.js instead of broad `'unsafe-inline'`.
- Raise security concerns early during implementation and code review.

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

### Commit Messages

1. Capitalize the first word
2. Use imperative mood ("Add feature" not "Added feature")
3. Limit to 72 characters
4. No trailing period

A properly formed message completes: _"If applied, this commit will **your message**"_

## File Structure

### Flat Business Modules

`src/modules/*` contains business/product modules only. Support layers live outside `modules`.

```
└── src/
    ├── app/
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
    │   │   └── assets/
    │   ├── dashboard/
    │   ├── marketing/
    │   └── page-shell/
    ├── ui/
    ├── services/
    ├── utilities/
    └── test/
```

Business modules should not import other business modules by default. Compose multiple modules in `src/app`, or extract a shared business primitive into its own module, such as `modules/money`.

### No File Prefixing

Don't repeat the module name in filenames — both IDE search and imports already provide context:

```
├── payments/
│   ├── api.ts            # ✅
│   ├── payments.api.ts   # ❌
```

### Hook Files with Suffixes

```
├── hooks/
│   ├── useOrderStatusQuery.ts    # data fetching
│   ├── useRevokeOrderMutation.ts # mutation
│   ├── usePaymentDetailsStore.ts # store
│   └── useCheckout.ts            # general hook
```

### Separate Zod Schemas from Types

Keep schemas in `schemas.ts` and types in `types.ts`. Don't mix them — but models and types belong together in `types.ts`.

## JavaScript Conventions

### Static Constants Use Uppercase

Use `UPPER_SNAKE_CASE` for module-level static constants, including dates, lookup tables, query keys, config objects, and static UI/content arrays.

```ts
// ❌
const invoiceRiskDate = new Date("2026-05-09");
const actionPriorityWeights = { critical: 4, high: 3 };

// ✅
const INVOICE_RISK_DATE = new Date("2026-05-09");
const ACTION_PRIORITY_WEIGHTS = { critical: 4, high: 3 };
```

Keep local runtime values in regular camelCase:

```ts
const invoiceRiskTotal = getInvoiceRiskTotal(invoices, INVOICE_RISK_DATE);
```

### No Single-Letter Variables

```js
// ❌
const expand = (e) => {
  e.preventDefault();
};

// ✅
const expand = (event) => {
  event.preventDefault();
};
```

### TypeScript Type Property Ordering

Always declare required properties before optional ones. Within each group, order properties alphabetically.

This ordering makes a component's contract immediately readable — the essential shape is visible at a glance, and optional customisation sits below it.

```ts
// ❌
type CardProps = {
	className?: string;
	title: string;
	variant?: "default" | "outline";
	children: React.ReactNode;
	href?: string;
};

// ✅
type CardProps = {
	children: React.ReactNode;
	title: string;
	className?: string;
	href?: string;
	variant?: "default" | "outline";
};
```

### Array of Objects Type Syntax
Prefer the inline array syntax `T[]` over `Array<T>` for object types. For object shapes used more than once, extract a named type.
This keeps generics clean and makes reuse explicit — the type name becomes part of the component's vocabulary.
```ts
// ❌
options: Array<{ label: string; value: string }>;

// ✅ (inline, single use)
options: { label: string; value: string }[];

// ✅✅ (extracted, when reused or semantically meaningful)
type Option = {
	label: string;
	value: string;
};

options: Option[];
```

### Numeric Separators for Large Literals

Use numeric separators for numeric literals with four or more digits. Keep user-facing strings, dates, URLs, SQL seed files, and SVG geometry in their native format.

```js
// ❌
const cashBalanceCents = 41200000;
const vendorLeakSavingsCents = 261000;

// ✅
const cashBalanceCents = 41_200_000;
const vendorLeakSavingsCents = 261_000;
```

### Count User-Visible Characters With Intl.Segmenter

Use grapheme clusters for user-facing character counts, text limits, and counters. JavaScript's `.length` counts UTF-16 code units, so emoji sequences, flags, skin-tone modifiers, and many non-Latin scripts can be counted as multiple characters even when users see one.

Use the shared `countCharacters` utility from `utilities/text/countCharacters` instead of inlining `Intl.Segmenter`. MDN reference: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter

```ts
// ❌ Counts UTF-16 code units.
const characterCount = value.length;

// ❌ Better, but still splits zero-width-joiner emoji sequences.
const characterCount = Array.from(value).length;

// ✅ Counts user-visible characters.
const characterCount = countCharacters(value);
```

Use `granularity: "word"` for user-facing word counts in languages without space-delimited words. Do not use grapheme counts for database byte limits, ASCII-only protocols, or backend validation that explicitly enforces UTF-8 bytes or another storage-specific definition.

### Boolean Naming: Prefer Adjective Form

Prefixing with "is" or "has" adds noise when a clean adjective exists. The name already implies a boolean:

```js
// ❌
const isActive = true;
const isSelected = false;

// ✅
const active = true;
const selected = false;
const hasFooter = true; // OK when no good adjective form exists
```

When a noun is involved, put it first:

```js
// ❌
if (visibleModal) { ... }

// ✅
if (modalVisible) { ... }
```

Prefixing _functions_ with "is" or "has" is fine — functions ask questions:

```js
const disabled = isDisabled();
```

### Descriptive Function Names

```js
// ❌
const onClick = () => { ... };
const handleClick = () => { ... };

// ✅
const submitForm = () => { ... };
const handleScroll = (event) => { ... };  // OK when receiving event object directly
```

## React Conventions

### Component Naming

Use the shortest name that gives enough context. Avoid names that collide with design system primitives (`Icon`, `Dropdown`), but don't over-prefix either:

```
├── Button/
│   ├── ButtonIcon.js    # ✅ Prefix avoids collision with global Icon
├── CarAdPage/
│   ├── AboutCarSection.js   # ✅ Specific enough
│   ├── CarAdPageAboutSection.js  # ❌ Over-prefixed
```

### Newlines Between JSX Blocks

```jsx
// ✅
<Heading as="h1" variant="s">
  {spec?.vehicleName}
</Heading>

<dl className={styles.specs}>
```

### Destructure JSX Map Items

When mapping object arrays in JSX, destructure item properties in the callback parameters so the rendered shape is clear at the boundary. Put the `key` prop first on the mapped JSX element or component:

```jsx
// ❌
{footerLinks.map((group) => (
  <FooterGroup links={group.links} key={group.label} title={group.label} />
))}

// ✅
{footerLinks.map(({ label, links }) => (
  <FooterGroup key={label} links={links} title={label} />
))}
```

### Local Helpers and List Keys

Avoid extra named helpers for trivial one-off formatting (for example `week.slice(5)`); inline it at the call site or in a small prop callback so the main export stays easy to scan top-to-bottom.

When list rows need stable unique keys and the domain field can repeat (for example the same calendar date twice), prefer deriving a stable key alongside the data (for example in the view-model `map` using `rowIndex`) rather than adding mapping helpers in the component.

For non-trivial repeated logic, prefer `function helperName(...) {}` near the bottom of the file over arrow-const module-level helpers.

### Use key for Intentional Component Resets

React uses `key` for component identity, not only list diffing. When a component's local state should be thrown away after switching to a different entity, prefer a stable identity key over effect-based prop-to-state synchronization.

```tsx
// ❌ Manual reset logic is easy to make stale.
useEffect(() => {
	resetForm(user);
}, [user]);

// ✅ A new user identity remounts the form and resets local state.
<UserForm key={user.id} user={user} />
```

Good fits include forms, modals, tabs, profile switchers, and dashboards where stale local state, subscriptions, or animations should restart for a new entity. Key by the smallest stable domain identity that should own the state, such as `user.id`, `workspace.id`, or `selectedTabId`.

Do not use keyed remounts when preserving local state is part of the experience, or when the component owns heavy work, expensive subscriptions, or a large subtree that would be costly to recreate. In those cases, keep explicit state transitions near the component that owns the behavior.

### Export Query Keys

Extract and export `queryKey` from query hooks so they can be reused for invalidation:

```ts
const REPORTS_QUERY_KEY = ['reports'];

const useReportsDataQuery = () => useQuery({ queryKey: REPORTS_QUERY_KEY, queryFn: fetchReports });

export { REPORTS_QUERY_KEY, useReportsDataQuery };
```

### Use React Query Instead of Async Effects

```ts
// ❌ Manual async in useEffect
useEffect(() => {
  const fetch = async () => { ... };
  fetch();
}, []);

// ✅ React Query
const { mutate, isLoading } = useMutation({
  queryFn: validateReceipt,
  onSuccess: setPurchaseId,
  onError: Sentry.Native.captureException,
});
```

### Zod Schema Patterns

**Static data** — use constants:

```ts
const USER_SCHEMA = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});
```

**Dynamic data** — use functions:

```ts
const getSchema = (userType: 'individual' | 'company') =>
  z.object({
    email: z.string(),
    ...(userType === 'company' && { companyName: z.string() }),
  });
```

**Needs hooks** — use a custom hook:

```ts
const useGetSchema = ({ lastOdometerRecord }: Props) => {
  const { t } = useTranslation('maintenanceSection');
  const { formatMileage } = useMeasurementFormat();

  return z.object({
    mileage: z.number().min(lastOdometerRecord.value + 1, {
      message: t('formError.minMileage', { mileage: formatMileage(minMileage) }),
    }),
  });
};
```

### Use Logical Expressions for cn() Conditions

```jsx
// ❌
className={cn('w-full', { 'bg-dark': darkMode })}

// ✅
className={cn('w-full', darkMode && 'bg-dark')}
```

### Prefer :has() Over Styling-Only React State

When a parent style depends only on descendant structure or native element state, consider CSS `:has()` instead of React state, event handlers, wrapper elements, or prop drilling. Use it when the selector is clearer than lifting a state class to the component root.

```tsx
// ❌ Styling-only state and handler.
const [invalid, setInvalid] = useState(false);

return (
	<form className={cn(invalid && "border-warning")}>
		<input onChange={(event) => setInvalid(!event.currentTarget.validity.valid)} />
	</form>
);
```

```css
/* ✅ CSS handles the structural relationship. */
form:has(input:invalid) {
	border-color: var(--warning);
}
```

Good fits include `form:has(input:invalid)`, `li:has(input:checked)`, `.grid:has(> :nth-child(4))`, and `article:not(:has(img))`. Keep the condition in JavaScript when explicit downward state flow is easier to read, when future readers will expect the state near the component root, or when the condition also drives behavior, data fetching, accessibility attributes, analytics, business rules, API results, feature flags, permissions, or multi-step user state.

Avoid chained, deeply nested, or broad `:has()` selectors on large or frequently mutating DOMs. Selectors such as `.card:has(.selected):has(.error)` shift state work into the CSS engine and can be more expensive to re-evaluate during DOM mutations.

### Prefer Native View Transitions Before Animation Dependencies

For page-level crossfades, route state changes, and shared element morphs, check whether the browser View Transition API covers the interaction before adding `motion`, Framer Motion, GSAP, or another runtime animation dependency.

Use native View Transitions when the animation is snapshot-based:

- same-document UI changes can use `document.startViewTransition(() => updateDom())`
- shared elements can use a stable `view-transition-name`
- MPA page navigations can use `@view-transition { navigation: auto; }` when browser support matches the audience
- timing and easing should live in CSS via `::view-transition-*` pseudo-elements

Keep an animation library for gesture-driven interactions, drag physics, spring behavior, interruption-heavy animations, or complex staggered choreography. In Next.js, do not enable `experimental.viewTransition` in production unless the framework docs mark it production-ready for the version in use.

### Explicit Children Prop

```ts
// ❌
type Props = React.PropsWithChildren & { title: string };

// ✅
type Props = { children: React.ReactNode; title: string };
```

### Avoid returnObjects: true (Unless Translating Arrays)

```ts
// ❌ Object shape
const { title, description } = t('activity.export', { returnObjects: true });

// ✅ Array shape
const activities = t('activities', { returnObjects: true });
```

## CSS Conventions

### Nest Modifiers Inside Elements

```scss
// ❌
.m { .subtitle { ... } }

// ✅
.subtitle {
  .m & { ... }
  .l & { ... }
}
```

### Avoid Nesting Modifier Classes for Self-Modification

```scss
// ❌ Higher specificity, harder to override
.root { &.highlighted { ... } }

// ✅
.root { ... }
.highlighted { ... }
```

### Use Design Tokens, Not Fixed Pixels

```css
// ❌
.popup {
  width: 420px;
}

// ✅
.popup {
  width: theme.size(52.5);
}
```

## Testing

For comprehensive testing guidelines, read the **TESTING** skill. Key principles:

- Test user behavior, not implementation details
- Prefer testing top-level components (pages/screens)
- Group related assertions in a single `it` block
- Use accessible queries (`getByRole` first)
- Use real services over mocks
- Use `it.each` for repetitive test cases
- Test actual translated content, not translation keys
