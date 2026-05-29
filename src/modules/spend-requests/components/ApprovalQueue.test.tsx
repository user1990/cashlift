import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { workspaceDatasetQueryKeys } from "@/modules/workspace/query";
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
	});

	it("submits an approved request decision", async () => {
		const user = userEvent.setup();
		let resolveDecision!: (result: { id: string; status: "approved" }) => void;
		const decision = new Promise<{ id: string; status: "approved" }>((resolve) => {
			resolveDecision = resolve;
		});
		mocks.decideSpendRequest.mockReturnValue(decision);
		renderApprovalQueue();

		await user.click(screen.getByRole("button", { name: "Approve BrandForge" }));

		expect(screen.getByRole("button", { name: "Approve BrandForge" })).toBeDisabled();
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

function renderApprovalQueue() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				staleTime: Number.POSITIVE_INFINITY,
			},
		},
	});

	render(
		<QueryClientProvider client={queryClient}>
			<ApprovalQueue datasetQueryKey={workspaceDatasetQueryKeys.all} requests={financialDatasetFixture.spendRequests} />
		</QueryClientProvider>,
	);
}
