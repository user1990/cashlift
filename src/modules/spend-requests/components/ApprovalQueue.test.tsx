import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { WORKSPACE_DATASET_QUERY_KEYS } from "@/modules/workspace/query";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { server } from "@/test/server";
import { Toaster } from "@/ui/components/feedback/Toaster";
import { createDecideSpendRequestHandler } from "../fixtures";
import { ApprovalQueue } from "./ApprovalQueue";

describe("ApprovalQueue", () => {
	it("shows request context without mutation controls in read-only mode", () => {
		render(
			<ApprovalQueue
				datasetQueryKey={WORKSPACE_DATASET_QUERY_KEYS.all}
				readOnly
				requests={financialDatasetFixture.spendRequests}
			/>,
		);

		expect(screen.getByText("BrandForge")).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: /approve/i })).not.toBeInTheDocument();
		expect(screen.queryByRole("button", { name: /reject/i })).not.toBeInTheDocument();
	});

	it("submits an approved request decision", async () => {
		const user = userEvent.setup();
		const { resolveDecision } = mockSpendRequestDecisionPending();
		const queryClient = renderApprovalQueue();

		await user.click(screen.getByRole("button", { name: "Approve BrandForge" }));

		expect(screen.getByRole("button", { name: "Approve BrandForge" })).toBeDisabled();
		resolveDecision();

		expect(await screen.findByText("Spend approved")).toBeInTheDocument();
		expect(getSpendRequestStatuses(queryClient)).toEqual({
			"request-brandforge": "approved",
			"request-client-onsite": "pending",
			"request-webcam": "approved",
		});
	});

	it("rolls back the optimistic request when the mutation fails", async () => {
		const user = userEvent.setup();
		mockSpendRequestDecisionFailure();
		renderApprovalQueue();

		await user.click(screen.getByRole("button", { name: "Reject Delta" }));

		expect(await screen.findByText("Spend update failed")).toBeInTheDocument();
		expect(await screen.findByText("Unable to update spend request.")).toBeInTheDocument();
		expect(screen.getByText("Delta")).toBeInTheDocument();
	});

	it("disables every decision control while a decision is pending", async () => {
		const user = userEvent.setup();
		mockSpendRequestDecisionPending();
		renderApprovalQueue();

		await user.click(screen.getByRole("button", { name: "Approve BrandForge" }));

		expect(screen.getByRole("button", { name: "Approve Delta" })).toBeDisabled();
		expect(screen.getByRole("button", { name: "Reject Delta" })).toBeDisabled();
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
	server.use(
		createDecideSpendRequestHandler(() =>
			HttpResponse.json({ error: "Unable to update spend request." }, { status: 500 }),
		),
	);
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
			<ApprovalQueue
				datasetQueryKey={WORKSPACE_DATASET_QUERY_KEYS.all}
				requests={financialDatasetFixture.spendRequests}
			/>

			<Toaster />
		</QueryClientProvider>,
	);

	return queryClient;
}

function getSpendRequestStatuses(queryClient: QueryClient) {
	const dataset = queryClient.getQueryData<typeof financialDatasetFixture>(WORKSPACE_DATASET_QUERY_KEYS.all);

	return Object.fromEntries(dataset?.spendRequests.map(({ id, status }) => [id, status]) ?? []);
}
