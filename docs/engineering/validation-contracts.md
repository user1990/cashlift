---
title: Validation contracts
description: Treat runtime schemas as the source of truth at every data boundary.
---

Runtime schemas are the source of truth for data that crosses a boundary. TypeScript types inside the app should be inferred from those schemas so the contract stays in sync automatically.

## Rule

- Parse external input at every entry point: route params, request bodies, query strings, API responses, Supabase rows after mapping, environment values, fixtures, and other untrusted data.
- Export app types with `z.infer<typeof schema>` instead of duplicating string unions or object shapes by hand.
- Do not use type assertions to turn untrusted data into trusted domain data.
- Keep static schemas as constants in `schemas.ts`; use schema factory functions only when the shape depends on dynamic data.
- Use `safeParse` only when the caller needs to branch on validation failure. Use `parse` when invalid input should fail the boundary immediately.

## Extracting schema fragments

Inline simple built-in validators and field-local enums by default. Extract schemas when they define a meaningful domain contract, centralize shared application-specific validation, or substantially improve readability.

A named TypeScript type alone does not require a separate schema. Derive types from existing validated models instead of duplicating their definitions.

Use `UPPER_SNAKE_CASE_SCHEMA` for schema values and PascalCase for types. Keep schemas with their owning module.

Mutation inputs must explicitly allow supported outcomes. Derive consumer types from the mutation-input schema. When deriving from a broader enum, use an explicit subset (for example `SPEND_REQUEST_STATUS_SCHEMA.extract(["approved", "rejected"])`) rather than excluding values, so future lifecycle states are not accepted as mutation outcomes automatically.

Apply this policy to new or materially changed code; do not perform cosmetic migrations.

## Pattern

```ts
export const SPEND_REQUEST_STATUS_SCHEMA = z.enum(["pending", "approved", "rejected"]);

export const SPEND_REQUEST_SCHEMA = z.object({
	id: z.string(),
	status: SPEND_REQUEST_STATUS_SCHEMA,
});

export type SpendRequest = z.infer<typeof SPEND_REQUEST_SCHEMA>;

const response = await fetch("/api/v1/workspace/spend-requests");
const spendRequest = SPEND_REQUEST_SCHEMA.parse(await response.json());
```

The schema is the contract. If input does not match, it does not enter the trusted app model.
