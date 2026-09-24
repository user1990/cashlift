# Frontend Guide Reference

Rules live in `.agents/skills/guide/SKILL.md` — that file is the authoritative policy. Use this reference for examples and deep links only.

## Rule inventory (see SKILL for full text)

- **Stack** — `package.json`, next-intl, nuqs, Tailwind v4, React Compiler.
- **File and module layout** — `src/modules`, hooks naming, `schemas.ts` / `types.ts`, `@/*` imports.
- **TypeScript** — naming, optional vs undefined, `T[]`, numeric separators, `countCharacters`, formatters.
- **React** — component structure, query keys, React Query mutations (`data-fetching.md`), local `useOptimistic`, `cn()`, `:has()`, View Transitions, truthful claims, browser time, conflicting-control locks.
- **Internationalization** — `en.json`, `useTranslations` / `getTranslations`, `t.raw`.
- **Security** — load `security/SKILL.md` at trust boundaries.
- **Git** — branch prefixes, PR titles, commit messages.
- **Testing** — load `testing/SKILL.md`.
- **Playwright (E2E)** — locators, route patterns, pending-lock vs journey tests, `e2e/playwright/*`.

## Canonical implementations

Copy from `docs/engineering/canonical-examples.md` before inventing a new pattern. High-signal references:

| Topic | Code |
| --- | --- |
| Mutation + locked controls | `src/modules/spend-requests/hooks/useSpendRequestDecision.ts` |
| Approval workflow test | `src/modules/dashboard/cockpits/ApprovalsCockpit.test.tsx` |
| Data fetching rules | `docs/engineering/data-fetching.md` |
| Forms | `docs/engineering/forms-and-input.md` |
| next-intl | `docs/engineering/i18n.md`, `src/services/i18n/messages/en.json` |
| Money display | `src/modules/money/components/MoneyDisplay.tsx` |
| Text field primitive | `src/ui/components/forms/TextField.tsx` |

## Module layout (spend-requests)

```text
src/modules/spend-requests/
├── components/
├── hooks/
│   ├── useSpendRequestsQuery.ts
│   └── useSpendRequestDecision.ts
├── api.ts
├── server.ts
├── schemas.ts
├── types.ts
└── utils.ts
```

## Optional JSX

```tsx
{action && <div className="shrink-0">{action}</div>}
{!items.length && <li>No items</li>}
{count > 0 && <span>{count} selected</span>}
{isOpen ? <ExpandedPanel /> : <CollapsedPanel />}
```

## Query keys

```ts
export const spendRequestsQueryKey = (workspaceId: string) => ["spend-requests", workspaceId];

export const useSpendRequestsQuery = (workspaceId: string) =>
	useQuery({ queryKey: spendRequestsQueryKey(workspaceId), queryFn: () => fetchSpendRequests(workspaceId) });
```

## next-intl (client)

```tsx
const t = useTranslations("WorkspaceNav");
return <span>{t("overview")}</span>;
```
