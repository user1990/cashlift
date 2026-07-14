import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { useWorkspaceDatasetQuery, workspaceDatasetQueryKeys } from "./query";

describe("useWorkspaceDatasetQuery", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("keeps the hydrated range fresh and refetches another range", async () => {
		const hydratedDateRange = { endDate: "2026-06-17", startDate: "2026-05-06" };
		const selectedDateRange = { endDate: "2026-05-20", startDate: "2026-05-06" };
		const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(JSON.stringify(financialDatasetFixture), {
				headers: { "Content-Type": "application/json" },
				status: 200,
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
		expect(fetchMock).not.toHaveBeenCalled();

		await queryClient.invalidateQueries({ queryKey: workspaceDatasetQueryKeys.scope("overview", hydratedDateRange) });

		await waitFor(() => {
			expect(fetchMock).toHaveBeenCalledOnce();
		});

		rerender({ dateRange: selectedDateRange });

		await waitFor(() => {
			expect(fetchMock).toHaveBeenCalledTimes(2);
		});
	});
});
