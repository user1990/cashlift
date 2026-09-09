// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { useWorkspaceDatasetQuery, WORKSPACE_DATASET_QUERY_KEYS } from "./query";

describe("useWorkspaceDatasetQuery", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("keeps the hydrated range fresh and refetches another range", async () => {
		const hydratedDateRange = { endDate: "2026-06-17", startDate: "2026-05-06" };
		const selectedDateRange = { endDate: "2026-05-20", startDate: "2026-05-06" };
		const selectedRangeDataset = {
			...financialDatasetFixture,
			profile: { ...financialDatasetFixture.profile, name: "Selected range" },
		};
		const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
			const url = new URL(String(input), "https://cashlift.test");
			const dataset =
				url.searchParams.get("endDate") === selectedDateRange.endDate ? selectedRangeDataset : financialDatasetFixture;

			return new Response(JSON.stringify(dataset), {
				headers: { "Content-Type": "application/json" },
				status: 200,
			});
		});
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
		expect(fetchMock).not.toHaveBeenCalled();

		await queryClient.invalidateQueries({
			queryKey: WORKSPACE_DATASET_QUERY_KEYS.scope("overview", hydratedDateRange),
		});

		await waitFor(() => {
			expect(fetchMock).toHaveBeenCalledOnce();
		});

		rerender({ dateRange: selectedDateRange });

		await waitFor(() => {
			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(result.current.data).toEqual(selectedRangeDataset);
		});

		const selectedRequest = fetchMock.mock.calls[1]?.[0];
		const selectedUrl = new URL(String(selectedRequest), "https://cashlift.test");

		expect(selectedUrl.searchParams.get("scope")).toBe("overview");
		expect(selectedUrl.searchParams.get("startDate")).toBe(selectedDateRange.startDate);
		expect(selectedUrl.searchParams.get("endDate")).toBe(selectedDateRange.endDate);
	});

	it("keeps stale data visible and avoids retrying permanent access failures", async () => {
		const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(
				JSON.stringify({
					code: "workspace_forbidden",
					error: "No company workspace is assigned to this user.",
				}),
				{ status: 403 },
			),
		);
		const queryClient = new QueryClient();
		const wrapper = ({ children }: { children: ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);

		const { result } = renderHook(
			() =>
				useWorkspaceDatasetQuery(financialDatasetFixture, "overview", {
					endDate: "2026-05-20",
					startDate: "2026-05-06",
				}),
			{ wrapper },
		);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.data).toEqual(financialDatasetFixture);
		expect(result.current.error?.message).toBe("No company workspace is assigned to this user.");
		expect(fetchMock).toHaveBeenCalledOnce();
	});
});
