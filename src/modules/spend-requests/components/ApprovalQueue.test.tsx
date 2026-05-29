import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useWorkspaceDatasetQuery, workspaceDatasetQueryKeys } from "@/modules/workspace/query";
import type { FinancialDataset } from "@/modules/workspace/types";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { ApprovalQueue } from "./ApprovalQueue";

const mocks = vi.hoisted(() => ({
	decideSpendRequest: vi.fn(),
	fetch: vi.fn(),
}));

vi.mock("../api", () => ({
	decideSpendRequest: mocks.decideSpendRequest,
}));

describe("ApprovalQueue", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.fetch.mockResolvedValue({
			json: vi.fn().mockResolvedValue({
				...financialDatasetFixture,
				spendRequests: financialDatasetFixture.spendRequests.map((request) =>
					request.id === "request-brandforge" ? { ...request, status: "approved" } : request,
				),
			}),
			ok: true,
		});
		vi.stubGlobal("fetch", mocks.fetch);
	});

	it("removes an approved request optimistically and renders refetched workspace data after success", async () => {
		const user = userEvent.setup();
		let resolveDecision!: (result: { id: string; status: "approved" }) => void;
		const decision = new Promise<{ id: string; status: "approved" }>((resolve) => {
			resolveDecision = resolve;
		});
		mocks.decideSpendRequest.mockReturnValue(decision);
		mocks.fetch.mockResolvedValueOnce({
			json: vi.fn().mockResolvedValue({
				...financialDatasetFixture,
				spendRequests: financialDatasetFixture.spendRequests.map((request) => ({
					...request,
					status: "approved",
				})),
			}),
			ok: true,
		});
		renderApprovalQueue();

		await user.click(screen.getByRole("button", { name: "Approve BrandForge" }));

		expect(screen.queryByText("BrandForge")).not.toBeInTheDocument();
		resolveDecision({ id: "request-brandforge", status: "approved" });

		await waitFor(() => {
			expect(mocks.decideSpendRequest).toHaveBeenCalledWith(
				{
					id: "request-brandforge",
					status: "approved",
				},
				expect.anything(),
			);
		});
		expect(await screen.findByText("No pending spend requests.")).toBeInTheDocument();
	});

	it("rolls back the optimistic request when the mutation fails", async () => {
		const user = userEvent.setup();
		mocks.decideSpendRequest.mockRejectedValue(new Error("Unable to update spend request."));
		renderApprovalQueue();

		await user.click(screen.getByRole("button", { name: "Reject Delta" }));

		expect(await screen.findByText("Unable to update spend request.")).toBeInTheDocument();
		expect(screen.getByText("Delta")).toBeInTheDocument();
	});
});

function ApprovalQueueHarness({ dataset }: { dataset: FinancialDataset }) {
	const { data } = useWorkspaceDatasetQuery(dataset, "approvals");
	const requests = data?.spendRequests;

	if (!requests) {
		throw new Error("Expected approvals dataset to be available before rendering ApprovalQueueHarness.");
	}

	return <ApprovalQueue datasetQueryKey={workspaceDatasetQueryKeys.all} requests={requests} />;
}

function renderApprovalQueue(dataset: FinancialDataset = financialDatasetFixture) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				staleTime: Number.POSITIVE_INFINITY,
			},
		},
	});
	queryClient.setQueryData(workspaceDatasetQueryKeys.scope("approvals"), dataset);

	render(
		<QueryClientProvider client={queryClient}>
			<ApprovalQueueHarness dataset={dataset} />
		</QueryClientProvider>,
	);
}
