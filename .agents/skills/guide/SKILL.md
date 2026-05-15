---
name: guide
description: Coding conventions, file structure, Git/PR/commit rules, React/Zod/React Query patterns, and i18n rules. Trigger when writing TS/React code, naming things, structuring files, creating branches/commits/PRs, or looking up team conventions.
---

# Frontend Guide

Coding style, conventions, and workflow for frontend development.

## Technology Stack

| Category   | Tools                                                  |
| ---------- | ------------------------------------------------------ |
| Runtime    | Node.js + pnpm                                         |
| Language   | TypeScript                                             |
| Frameworks | React, Next.js                                          |
| Auth/Data  | Clerk, Supabase JS                                      |
| State      | Zustand, TanStack Query (React Query), React Hook Form |
| Styling    | Tailwind CSS                                           |
| i18n       | next-intl                                              |
| Testing    | Vitest                                                 |
| Linting    | Biome (lint + format)                                  |
| Utilities  | Zod, date-fns, Recharts, react-aria-components, lucide-react, class-variance-authority, clsx, tailwind-merge |

## Security Guidelines

Security is a shared responsibility. Keep these baseline rules in mind for all feature work:

- Follow OWASP Top Ten guidance and common web security practices.
- Validate and sanitize all external input at boundaries (API, forms, URL params, storage).
- Raise security concerns early during implementation and code review.

## Feature Delivery Workflow

1. Create a feature branch off `main`
2. Implement the feature
3. Create a pull request from the feature branch to `main`
4. Assign and ping code reviewers
5. Share the link to preview deployment in the domain's Slack channel
6. Address feedback and receive approval
7. Merge the pull request via **"Squash and merge"**
8. Validate the feature on production

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
project(s): Description
```

Examples:

- `web-app: Update homepage hero`
- `web-app/report-viewer/tailwind-config: Update design system colors`

### Commit Messages

1. Capitalize the first word
2. Use imperative mood ("Add feature" not "Added feature")
3. Limit to 72 characters
4. No trailing period

A properly formed message completes: _"If applied, this commit will **your message**"_

## File Structure

### Module-Based Organization

Each module encapsulates a specific domain or feature:

```
└── src/modules/
    └── payments/
        ├── components/
        ├── hooks/
        │   ├── index.ts
        │   ├── useOrderStatusQuery.ts
        │   └── useCheckout.ts
        ├── constants.ts
        ├── utils.ts
        ├── api.ts
        ├── schemas.ts
        ├── types.ts
        └── assets/
```

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
