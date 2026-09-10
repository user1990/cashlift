// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { WORKSPACE_DATASET_QUERY_KEYS } from "@/modules/workspace/query";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { server } from "@/test/server";
import { createDecideSpendRequestHandler } from "../fixtures";
import { ApprovalQueue } from "./ApprovalQueue";

const APPROVAL_QUEUE_REQUESTS_MOCK = financialDatasetFixture.spendRequests.slice(0, 2);

vi.mock("@/ui/components/feedback/Toaster", () => ({
	Toaster: () => null,
}));

describe("ApprovalQueue", () => {
	it("submits an approved request decision and locks every control while pending", async () => {
		const user = userEvent.setup({ delay: null });
		const { resolveDecision } = mockSpendRequestDecisionPending();
		const queryClient = renderApprovalQueue();

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

	it("rolls back the optimistic request when the mutation fails", async () => {
		const user = userEvent.setup({ delay: null });
		const rejectDecision = mockSpendRequestDecisionFailure();
		const queryClient = renderApprovalQueue();

		await user.click(screen.getByRole("button", { name: "Reject Delta" }));

		await waitFor(() => {
			expect(getSpendRequestStatuses(queryClient)["request-client-onsite"]).toBe("rejected");
		});

		rejectDecision();

		await waitFor(() => {
			expect(getSpendRequestStatuses(queryClient)).toEqual({
				"request-brandforge": "pending",
				"request-client-onsite": "pending",
				"request-webcam": "approved",
			});
			expect(screen.getByRole("button", { name: "Reject Delta" })).not.toBeDisabled();
		});
		expect(screen.getByText("Delta")).toBeInTheDocument();
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

function mockSpendRequestDecisionFailure() {
	let rejectDecision!: () => void;
	const decision = new Promise<void>((resolve) => {
		rejectDecision = resolve;
	});

	server.use(
		createDecideSpendRequestHandler(async () => {
			await decision;

			return HttpResponse.json({ error: "Unable to update spend request." }, { status: 500 });
		}),
	);

	return rejectDecision;
}

function renderApprovalQueue() {
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
			<ApprovalQueue datasetQueryKey={WORKSPACE_DATASET_QUERY_KEYS.all} requests={APPROVAL_QUEUE_REQUESTS_MOCK} />
		</QueryClientProvider>,
	);

	return queryClient;
}

function getSpendRequestStatuses(queryClient: QueryClient) {
	const dataset = queryClient.getQueryData<typeof financialDatasetFixture>(WORKSPACE_DATASET_QUERY_KEYS.all);

	return Object.fromEntries(dataset?.spendRequests.map(({ id, status }) => [id, status]) ?? []);
}
