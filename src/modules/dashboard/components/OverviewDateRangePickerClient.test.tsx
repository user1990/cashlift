// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OverviewDateRangePickerClient } from "./OverviewDateRangePickerClient";

describe("OverviewDateRangePickerClient", () => {
	it("does not expose hidden date segment spinbuttons in the tab order", async () => {
		const user = userEvent.setup();

		render(
			<OverviewDateRangePickerClient
				dateRange={{ endDate: "2024-06-17", startDate: "2024-05-20" }}
				fallbackLabel="May 20 – Jun 17, 2024"
				onDateRangeChange={vi.fn()}
			/>,
		);

		expect(screen.queryAllByRole("spinbutton")).toHaveLength(0);

		await user.tab();

		expect(document.activeElement).toHaveAccessibleName(/dashboard date range/i);
	});
});
