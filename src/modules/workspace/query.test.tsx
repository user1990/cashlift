// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { HttpResponse } from "msw";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { createWorkspaceDatasetHandler } from "@/test/fixtures/workspaceDatasetApi";
import { server } from "@/test/server";
import { useWorkspaceDatasetQuery, WORKSPACE_DATASET_QUERY_KEYS } from "./query";

describe("useWorkspaceDatasetQuery", () => {
	afterEach(() => {
		server.resetHandlers();
	});

	it("keeps the hydrated range fresh and refetches another range", async () => {
		const hydratedDateRange = { endDate: "2026-06-17", startDate: "2026-05-06" };
		const selectedDateRange = { endDate: "2026-05-20", startDate: "2026-05-06" };
		const selectedRangeDataset = {
			...financialDatasetFixture,
			profile: { ...financialDatasetFixture.profile, name: "Selected range" },
		};
		let requestCount = 0;

		server.use(
			createWorkspaceDatasetHandler(({ endDate, startDate }) => {
				requestCount += 1;

				const dataset =
					endDate === selectedDateRange.endDate && startDate === selectedDateRange.startDate
						? selectedRangeDataset
						: financialDatasetFixture;

				return HttpResponse.json(dataset);
			}),
		);

		const queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
					staleTime: 60_000,
				},
			},
		});
		const wrapper = ({ children }: { children: ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);
		const { result, rerender } = renderHook(
			({ dateRange }: { dateRange: typeof hydratedDateRange }) =>
				useWorkspaceDatasetQuery(financialDatasetFixture, "overview", dateRange),
			{ initialProps: { dateRange: hydratedDateRange }, wrapper },
		);

		expect(result.current.data).toEqual(financialDatasetFixture);
		expect(result.current.fetchStatus).toBe("idle");
		expect(requestCount).toBe(0);

		await queryClient.invalidateQueries({
			queryKey: WORKSPACE_DATASET_QUERY_KEYS.scope("overview", hydratedDateRange),
		});

		await waitFor(() => {
			expect(requestCount).toBe(1);
		});

		rerender({ dateRange: selectedDateRange });

		await waitFor(() => {
			expect(requestCount).toBe(2);
			expect(result.current.data).toEqual(selectedRangeDataset);
		});
	});

	it("keeps stale data visible and avoids retrying permanent access failures", async () => {
		let requestCount = 0;

		server.use(
			createWorkspaceDatasetHandler(() => {
				requestCount += 1;

				return HttpResponse.json(
					{
						code: "workspace_forbidden",
						error: "No company workspace is assigned to this user.",
					},
					{ status: 403 },
				);
			}),
		);

		const queryClient = new QueryClient();
		const wrapper = ({ children }: { children: ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);
		const matchingRange = { endDate: "2026-06-17", startDate: "2026-05-06" };

		const { result } = renderHook(() => useWorkspaceDatasetQuery(financialDatasetFixture, "overview", matchingRange), {
			wrapper,
		});

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.data).toEqual(financialDatasetFixture);
		expect(result.current.error?.message).toBe("No company workspace is assigned to this user.");
		expect(requestCount).toBe(1);
	});
});
