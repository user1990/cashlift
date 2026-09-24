// @vitest-environment jsdom

import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEMO_WORKSPACE_DATASET } from "@/modules/workspace/demoDataset";
import { useDashboardStatusDate } from "./useDashboardStatusDate";

describe("useDashboardStatusDate", () => {
	beforeEach(() => {
		vi.useFakeTimers({ toFake: ["Date"] });
		vi.setSystemTime(new Date("2024-05-20T12:00:00"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("uses the selected overview range after hydration", () => {
		const { result } = renderHook(() =>
			useDashboardStatusDate(DEMO_WORKSPACE_DATASET, { endDate: "2024-08-04", startDate: "2024-05-06" }),
		);

		expect(result.current).toEqual(new Date("2024-05-06T00:00:00"));
	});

	it("uses the browser date when no range is selected", () => {
		const { result } = renderHook(() => useDashboardStatusDate(DEMO_WORKSPACE_DATASET));

		expect(result.current).toEqual(new Date("2024-05-20T00:00:00"));
	});
});
