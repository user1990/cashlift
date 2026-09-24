# Frontend Guide Reference

Rules live in `.agents/skills/guide/SKILL.md`. Use this file for layout examples and pointers to verified implementations — not duplicated policy.

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
