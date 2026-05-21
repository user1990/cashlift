import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { ApprovalQueue } from "./ApprovalQueue";

const mocks = vi.hoisted(() => ({
	decideSpendRequestAction: vi.fn(),
	refresh: vi.fn(),
}));

vi.mock("../actions", () => ({
	decideSpendRequestAction: mocks.decideSpendRequestAction,
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		refresh: mocks.refresh,
	}),
}));

describe("ApprovalQueue", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("removes an approved request optimistically and refreshes after success", async () => {
		const user = userEvent.setup();
		let resolveAction!: (result: { refresh: boolean; status: "success" }) => void;
		const action = new Promise<{ refresh: boolean; status: "success" }>((resolve) => {
			resolveAction = resolve;
		});
		mocks.decideSpendRequestAction.mockReturnValue(action);
		render(<ApprovalQueue requests={financialDatasetFixture.spendRequests} />);

		await user.click(screen.getByRole("button", { name: "Approve BrandForge" }));

		expect(screen.queryByText("BrandForge")).not.toBeInTheDocument();
		resolveAction({ refresh: true, status: "success" });

		await waitFor(() => {
			expect(mocks.decideSpendRequestAction).toHaveBeenCalledWith({
				id: "request-brandforge",
				status: "approved",
			});
			expect(mocks.refresh).toHaveBeenCalled();
		});
	});

	it("rolls back the optimistic request when the action fails", async () => {
		const user = userEvent.setup();
		mocks.decideSpendRequestAction.mockResolvedValue({
			code: "unavailable",
			message: "Unable to update spend request.",
			status: "error",
		});
		render(<ApprovalQueue requests={financialDatasetFixture.spendRequests} />);

		await user.click(screen.getByRole("button", { name: "Reject Delta" }));

		await waitFor(() => {
			expect(screen.getByText("Unable to update spend request.")).toBeInTheDocument();
		});
		expect(screen.getByText("Delta")).toBeInTheDocument();
		expect(mocks.refresh).not.toHaveBeenCalled();
	});
});
