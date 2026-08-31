// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { formatPreciseCompactCurrency } from "@/modules/money/format";
import { createDecideSpendRequestHandler } from "@/modules/spend-requests/fixtures";
import { WORKSPACE_DATASET_QUERY_KEYS } from "@/modules/workspace/query";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { server } from "@/test/server";
import { buildDashboardViewModel } from "../view-model";
import { ApprovalsCockpit } from "./ApprovalsCockpit";
import { buildApprovalsPresentation } from "./approvalsModel";

vi.mock("@/ui/components/feedback/Toaster", () => ({
	Toaster: () => null,
}));

describe("ApprovalsCockpit", () => {
	it("renders the glass queue from the current dataset without inventing totals", () => {
		const dashboard = buildDashboardViewModel({
			dataset: financialDatasetFixture,
			date: new Date("2026-05-09T00:00:00"),
			role: "owner-finance",
		});
		const presentation = buildApprovalsPresentation(dashboard);

		render(<ApprovalsCockpit dataset={financialDatasetFixture} readOnly />);

		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(presentation.headline);
		expect(screen.getByText(presentation.contextLine)).toBeVisible();
		expect(screen.getByRole("heading", { name: dashboard.pendingApprovals[0]?.vendor })).toBeVisible();
		expect(screen.getByText(formatPreciseCompactCurrency(presentation.pendingAmountCents))).toBeVisible();
		expect(screen.getByText("Delta")).toBeVisible();
		expect(screen.getByText("Approval policy, kept quieter")).toBeVisible();
		expect(screen.queryByRole("button", { name: /approve/i })).not.toBeInTheDocument();
	});

	it("submits an approved request decision and locks every control while pending", async () => {
		const user = userEvent.setup({ delay: null });
		const { resolveDecision } = mockSpendRequestDecisionPending();
		const queryClient = renderApprovalsCockpit();

		await user.click(screen.getByRole("button", { name: "Approve BrandForge" }));

		expect(screen.getByRole("button", { name: "Approve BrandForge" })).toBeDisabled();
		expect(screen.getByRole("button", { name: "Reject Delta" })).toBeDisabled();

		resolveDecision();
		await waitFor(() => {
			expect(getSpendRequestStatuses(queryClient)).toEqual({
				"request-brandforge": "approved",
				"request-client-onsite": "pending",
				"request-webcam": "approved",
			});
		});
	});
});

function mockSpendRequestDecisionPending() {
	let resolveDecision!: () => void;
	const decision = new Promise<void>((resolve) => {
		resolveDecision = resolve;
	});

	server.use(
		createDecideSpendRequestHandler(async ({ params, request }) => {
			const { status } = await request.json();
			await decision;

			return HttpResponse.json({
				...financialDatasetFixture.spendRequests[0],
				id: params.id,
				status,
			});
		}),
	);

	return { resolveDecision };
}

function renderApprovalsCockpit() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				staleTime: Number.POSITIVE_INFINITY,
			},
		},
	});
	queryClient.setQueryData(WORKSPACE_DATASET_QUERY_KEYS.all, financialDatasetFixture);

	render(
		<QueryClientProvider client={queryClient}>
			<ApprovalsCockpit dataset={financialDatasetFixture} />
		</QueryClientProvider>,
	);

	return queryClient;
}

function getSpendRequestStatuses(queryClient: QueryClient) {
	const dataset = queryClient.getQueryData<typeof financialDatasetFixture>(WORKSPACE_DATASET_QUERY_KEYS.all);

	return Object.fromEntries(dataset?.spendRequests.map(({ id, status }) => [id, status]) ?? []);
}
