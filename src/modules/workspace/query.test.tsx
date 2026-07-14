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

	it("keeps server data fresh on mount and refetches after invalidation", async () => {
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

		const { result } = renderHook(() => useWorkspaceDatasetQuery(financialDatasetFixture, "overview"), { wrapper });

		expect(result.current.data).toEqual(financialDatasetFixture);
		expect(result.current.fetchStatus).toBe("idle");
		expect(fetchMock).not.toHaveBeenCalled();

		await queryClient.invalidateQueries({ queryKey: workspaceDatasetQueryKeys.scope("overview") });

		await waitFor(() => {
			expect(fetchMock).toHaveBeenCalledOnce();
		});
	});
});
