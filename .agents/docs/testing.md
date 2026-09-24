# Testing Reference

Rules live in `.agents/skills/testing/SKILL.md`. Examples only.

## MSW override

```ts
import { server } from "@/test/server";
import { createPatchSpendRequestHandler } from "@/test/fixtures/spendRequests";

server.use(createPatchSpendRequestHandler(() => HttpResponse.json({ status: "approved" })));
```

## Clerk boundary mock (server module test)

```ts
vi.mock("@clerk/nextjs/server", () => ({
	auth: vi.fn(() => ({ userId: "user_test" })),
}));
```

## Time-sensitive UI

```ts
vi.setSystemTime(new Date("2026-01-15T12:00:00Z"));
```

Prefer `vi.setSystemTime` over mocking `useDashboardStatusDate` unless the test documents a hook-timing workaround.

## Interaction flow

```ts
const user = userEvent.setup();
render(<ApprovalsCockpit dataset={DATASET_MOCK} />);

await user.click(screen.getByRole("button", { name: /approve/i }));
await waitFor(() => {
	expect(screen.getByRole("button", { name: /approve/i })).toBeDisabled();
});
```

Canonical journeys: `docs/engineering/canonical-examples.md`.
