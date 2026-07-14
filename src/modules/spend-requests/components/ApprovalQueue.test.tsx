import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { workspaceDatasetQueryKeys } from "@/modules/workspace/query";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { server } from "@/test/server";
import { Toaster } from "@/ui/components/Toaster";
import { createDecideSpendRequestHandler } from "../fixtures";
import { ApprovalQueue } from "./ApprovalQueue";

describe("ApprovalQueue", () => {
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

	it("keeps another successful decision when a concurrent decision rolls back", async () => {
		const user = userEvent.setup();
		const { rejectBrandForge, resolveDelta } = mockSpendRequestDecisionsConcurrent();
		const queryClient = renderApprovalQueue();

		await user.click(screen.getByRole("button", { name: "Approve BrandForge" }));
		await user.click(screen.getByRole("button", { name: "Approve Delta" }));

		resolveDelta();
		rejectBrandForge();

		await waitFor(() => {
			expect(getSpendRequestStatuses(queryClient)).toEqual({
				"request-brandforge": "pending",
				"request-client-onsite": "approved",
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

function mockSpendRequestDecisionFailure() {
	server.use(
		createDecideSpendRequestHandler(() =>
			HttpResponse.json({ error: "Unable to update spend request." }, { status: 500 }),
		),
	);
}

function mockSpendRequestDecisionsConcurrent() {
	let rejectBrandForge!: () => void;
	let resolveDelta!: () => void;
	const brandForgeDecision = new Promise<void>((_resolve, reject) => {
		rejectBrandForge = () => reject(new Error("Unable to update spend request."));
	});
	const deltaDecision = new Promise<void>((resolve) => {
		resolveDelta = resolve;
	});

	server.use(
		createDecideSpendRequestHandler(async ({ params, request }) => {
			const { status } = await request.json();

			if (params.id === "request-brandforge") {
				await brandForgeDecision;
			} else {
				await deltaDecision;
			}

			const requestFixture = financialDatasetFixture.spendRequests.find(({ id }) => id === params.id);

			if (!requestFixture) {
				return HttpResponse.json({ error: "Spend request not found." }, { status: 404 });
			}

			return HttpResponse.json({ ...requestFixture, status });
		}),
	);

	return { rejectBrandForge, resolveDelta };
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
	queryClient.setQueryData(workspaceDatasetQueryKeys.all, financialDatasetFixture);

	render(
		<QueryClientProvider client={queryClient}>
			<ApprovalQueue datasetQueryKey={workspaceDatasetQueryKeys.all} requests={financialDatasetFixture.spendRequests} />

			<Toaster />
		</QueryClientProvider>,
	);

	return queryClient;
}

function getSpendRequestStatuses(queryClient: QueryClient) {
	const dataset = queryClient.getQueryData<typeof financialDatasetFixture>(workspaceDatasetQueryKeys.all);

	return Object.fromEntries(dataset?.spendRequests.map(({ id, status }) => [id, status]) ?? []);
}
