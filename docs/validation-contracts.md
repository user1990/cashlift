# Validation Contracts

Runtime schemas are the source of truth for data that crosses a boundary. TypeScript types inside the app should be inferred from those schemas so the contract stays in sync automatically.

## Rule

- Parse external input at every entry point: route params, request bodies, query strings, API responses, Supabase rows after mapping, environment values, fixtures, and other untrusted data.
- Export app types with `z.infer<typeof schema>` instead of duplicating string unions or object shapes by hand.
- Do not use type assertions to turn untrusted data into trusted domain data.
- Keep static schemas as constants in `schemas.ts`; use schema factory functions only when the shape depends on dynamic data.
- Use `safeParse` only when the caller needs to branch on validation failure. Use `parse` when invalid input should fail the boundary immediately.

## Pattern

```ts
export const spendRequestSchema = z.object({
	id: z.string(),
	status: z.enum(["pending", "approved", "rejected"]),
});

export type SpendRequest = z.infer<typeof spendRequestSchema>;

const response = await fetch("/api/workspace/spend-requests");
const spendRequest = spendRequestSchema.parse(await response.json());
```

The schema is the contract. If input does not match, it does not enter the trusted app model.
