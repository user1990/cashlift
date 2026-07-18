import { act, renderHook, waitFor } from "@testing-library/react";
import { NuqsTestingAdapter, type UrlUpdateEvent } from "nuqs/adapters/testing";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { useOverviewDateRangeQueryState } from "./useOverviewDateRangeQueryState";

describe("useOverviewDateRangeQueryState", () => {
	it("restores a shared range and appends changes to browser history", async () => {
		const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
		const wrapper = ({ children }: { children: ReactNode }) => (
			<NuqsTestingAdapter hasMemory onUrlUpdate={onUrlUpdate} searchParams="?startDate=2026-05-10&endDate=2026-05-20">
				{children}
			</NuqsTestingAdapter>
		);
		const { result } = renderHook(() => useOverviewDateRangeQueryState(financialDatasetFixture), { wrapper });

		expect(result.current.dateRange).toEqual({ endDate: "2026-05-20", startDate: "2026-05-10" });

		act(() => {
			result.current.setDateRange({ endDate: "2026-05-27", startDate: "2026-05-20" });
		});

		await waitFor(() => {
			expect(onUrlUpdate).toHaveBeenCalledOnce();
		});

		expect(onUrlUpdate.mock.calls[0][0].queryString).toBe("?startDate=2026-05-20&endDate=2026-05-27");
		expect(onUrlUpdate.mock.calls[0][0].options.history).toBe("push");
	});

	it("keeps the default forecast range out of the URL", async () => {
		const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
		const wrapper = ({ children }: { children: ReactNode }) => (
			<NuqsTestingAdapter hasMemory onUrlUpdate={onUrlUpdate}>
				{children}
			</NuqsTestingAdapter>
		);
		const { result } = renderHook(() => useOverviewDateRangeQueryState(financialDatasetFixture), { wrapper });

		expect(result.current.dateRange).toEqual({ endDate: "2026-06-17", startDate: "2026-05-06" });

		act(() => {
			result.current.setDateRange({ endDate: "2026-06-17", startDate: "2026-05-06" });
		});

		await waitFor(() => {
			expect(onUrlUpdate).toHaveBeenCalledOnce();
		});

		expect(onUrlUpdate.mock.calls[0][0].queryString).toBe("");
	});
});
