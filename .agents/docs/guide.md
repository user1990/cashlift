# Frontend Guide Reference

Rules and conventions live in `.agents/skills/guide/SKILL.md`. Load this doc only when you need examples, rationale, or patterns not shown in the skill.

Related references:

- Architecture: `.agents/skills/architecture/SKILL.md`
- Styling: `.agents/skills/styling/SKILL.md` and `.agents/docs/styling.md`
- Testing: `.agents/skills/testing/SKILL.md` and `.agents/docs/testing.md`
- Stack: `package.json`

## File Structure

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
    │   │   └── utils.ts
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

`components/` contains React components and their tests only. A module-wide hook belongs in `hooks/`; shared module models and schemas belong in root `types.ts` and `schemas.ts`. Create a nested feature subtree only when the feature owns several cohesive files; it may use the same `components/`, `hooks/`, `types.ts`, `schemas.ts`, and `utils.ts` categories rather than mixing support files into `components/`.

```bash
  ├── module
  │   ├── payments
  │   │   ├── api.ts            # ✅ good
  │   │   ├── payments.api.ts   # ⛔️ bad
  └───├── ....
```

```bash
├── modules
  │   ├── payments
  │   │   ├── hooks
  │   │   │   ├── useOrderStatusQuery.ts
  │   │   │   ├── useRevokeOrderMutation.ts
  │   │   │   ├── usePaymentDetailsStore.ts
  │   │   │   └── useCheckout.ts
  └───├── ....
```

## JavaScript

### Single-letter variables

```js
// ⛔️ bad
reports.forEach((r, i) => { /* … */ });

// ✅ good
reports.forEach((report, index) => { /* … */ });
```

### Boolean naming

```js
// ⛔️ bad
const isActive = true;
if (visibleModal) { /* … */ }

// ✅ good
const active = true;
if (modalVisible) { /* … */ }
```

### Character counts

Use `countCharacters` from `utilities/text/countCharacters` for user-visible limits.

```ts
// ⛔️ bad
const characterCount = value.length;

// ✅ good
const characterCount = countCharacters(value);
```

### AbortController

```js
// ⛔️ bad: manual cleanup, listeners can leak
el.addEventListener('click', handler);
const res = await fetch('/api/slow');
el.removeEventListener('click', handler);

// ✅ good: one controller, one abort
const ctrl = new AbortController();
element.addEventListener('click', handler, { signal: ctrl.signal });
const res = await fetch('/api/slow', { signal: AbortSignal.timeout(5_000) });
ctrl.abort();
```

### structuredClone

```js
// ⛔️ bad: corrupts Date, Map, Set, undefined
const copy = JSON.parse(JSON.stringify(original));

// ✅ good
const copy = structuredClone(original);
```

### Promise.withResolvers

```js
// ⛔️ bad
let resolve, reject;
const promise = new Promise((res, rej) => { resolve = res; reject = rej; });

// ✅ good
const { promise, resolve, reject } = Promise.withResolvers();
```

### crypto.randomUUID

```js
// ⛔️ bad
import { v4 as uuid } from 'uuid';

// ✅ good
const id = crypto.randomUUID();
```

### Object.groupBy

```js
// ⛔️ bad
const grouped = items.reduce((acc, item) => {
  (acc[item.category] ??= []).push(item);
  return acc;
}, {});

// ✅ good
const grouped = Object.groupBy(items, item => item.category);
```

## TypeScript

### Discriminated unions

```ts
// ⛔️ bad: invalid combinations possible
type WorkspaceDatasetLoadResult = {
  dataset?: FinancialDataset;
  loading?: boolean;
  message?: string;
};

// ✅ good
type WorkspaceDatasetLoadResult =
  | { status: "loading" }
  | { dataset: FinancialDataset; status: "success" }
  | { message: string; status: "forbidden" | "unauthenticated" | "unavailable" };
```

### as const satisfies

```ts
// ⛔️ bad: widens literals
const ACTION_PRIORITY_WEIGHTS: Record<ActionPriority, number> = {
  critical: 4, high: 3, medium: 2, low: 1,
};

// ✅ good
const ACTION_PRIORITY_WEIGHTS = {
  critical: 4, high: 3, medium: 2, low: 1,
} as const satisfies Record<ActionPriority, number>;
```

### Property ordering and array types

```ts
// ⛔️ bad
type PanelProps = {
  as?: "article" | "div" | "section";
  children: React.ReactNode;
  className?: string;
};

// ✅ good
type PanelProps = {
  children: React.ReactNode;
  as?: "article" | "div" | "section";
  className?: string;
};

// ✅ good: inline one-off
const roleOptions: { label: string; value: CompanyRole }[] = [];
```

## React

### Component naming

```bash
├── DashboardPage
│   ├── CashOutlookSection.tsx           # ✅ specific enough
│   ├── DashboardPageCashOutlookSection.tsx  # ⛔️ repetitive prefix
├── Button
│   ├── ButtonIcon.tsx                   # ✅ gives context
│   ├── Icon.tsx                         # ⛔️ too generic
```

### Query keys

```ts
// ⛔️ bad: key not exported, duplicated string
const useReportsData = () => useQuery({ queryKey: 'queryKey', queryFn: fetchReports });

// ✅ good
const reportsQueryKey = ['reports'];
const useReportsDataQuery = () => useQuery({ queryKey: reportsQueryKey, queryFn: fetchReports });
export { reportsQueryKey, useReportsDataQuery };
```

### React Query over manual useEffect

```ts
// ⛔️ bad
useEffect(() => {
  let didCancel = false;
  const getPurchaseId = async () => {
    setLoading(true);
    try {
      const id = await validateReceipt(receipt);
      if (!didCancel) setPurchaseId(id);
    } finally {
      setLoading(false);
    }
  };
  getPurchaseId();
  return () => { didCancel = true; };
}, [receipt]);

// ✅ good
const { mutate, isPending } = useMutation({
  mutationFn: validateReceipt,
  onSuccess: setPurchaseId,
});
```

### useOptimistic

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
    if (result.status === "error") showError(result.message);
  });
};
```

### Zod schema shapes

```ts
// Static
const schema = z.object({ firstName: z.string().min(1), lastName: z.string().min(1) });

// Dynamic
const getSchema = (userType: 'individual' | 'company') =>
  z.object({
    email: z.string(),
    ...(userType === 'company' && { companyName: z.string() }),
  });

// Hook-backed translations
const useGetSchema = ({ lastOdometerRecord }: UseGetSchemaProps) => {
  const { t } = useTranslation('maintenanceSection');
  return z.object({
    mileage: z.number().min(lastOdometerRecord.value + 1, {
      message: t('formError.minMileage', { mileage: formatMileage(lastOdometerRecord) }),
    }),
  });
};
```

### cn() logical expressions

```jsx
// ⛔️ bad
<div className={cn('w-full', { 'bg-dark': darkMode })} />

// ✅ good
<div className={cn('w-full', darkMode && 'bg-dark')} />
```

### Intentional key resets

```tsx
// ⛔️ bad
useEffect(() => { resetForm(user); }, [user]);

// ✅ good
<UserForm key={user.id} user={user} />
```

### CSS :has() for styling-only state

See also `.agents/docs/styling.md`.

```tsx
// ⛔️ bad: styling-only React state
const [invalid, setInvalid] = useState(false);
return (
  <form className={cn(invalid && "border-warning")}>
    <input onChange={(event) => setInvalid(!event.currentTarget.validity.valid)} />
  </form>
);
```

```css
/* ✅ good */
form:has(input:invalid) {
  border-color: var(--warning);
}
```

### View Transitions

Prefer native View Transitions for snapshot-based fades and shared-element morphs before adding `motion` or similar libraries. Keep animation libraries for gestures, springs, and complex choreography.

### PropsWithChildren

```ts
// ⛔️ bad
type Props = React.PropsWithChildren & { title: string };

// ✅ good
type Props = { children: React.ReactNode; title: string };
```

### i18n returnObjects

```ts
// ⛔️ bad: returnObjects on object-shaped translations
return t(`activity.${event.type}`, { returnObjects: true });

// ✅ good: returnObjects only for arrays
const activities = t('activities', { returnObjects: true });
```

### Function naming

```js
// ⛔️ bad
const onClick = () => { /* … */ };

// ✅ good
const submitForm = () => { /* … */ };

// ✅ good when receiving an event
const handleScroll = (event) => { /* … */ };
```
