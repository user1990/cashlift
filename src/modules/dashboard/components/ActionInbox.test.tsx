// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { formatCurrency } from "@/modules/money/format";
import { DEMO_WORKSPACE_DATASET } from "@/modules/workspace/demoDataset";
import { formatDashboardDate } from "../overviewDateRangeLabel";
import { buildDashboardViewModel } from "../view-model";
import { ActionInbox } from "./ActionInbox";

describe("ActionInbox", () => {
	it("renders ranked actions with destinations for their decision type", () => {
		const dashboard = buildDashboardViewModel({
			dataset: DEMO_WORKSPACE_DATASET,
			date: new Date("2024-05-20T00:00:00"),
			role: "owner-finance",
		});
		const [firstAction] = dashboard.actionInbox;

		if (firstAction === undefined) {
			throw new Error("demo inbox must include a ranked action");
		}

		render(<ActionInbox actions={dashboard.actionInbox} basePath="/demo/workspace" />);

		const links = screen.getAllByRole("link");

		expect(links.map((link) => link.textContent)).toEqual([
			expect.stringContaining("Collect Aurora Health before buffer risk"),
			expect.stringContaining("Decide on Client Delivery hardware"),
			expect.stringContaining("Cancel Notion trial seats"),
		]);
		expect(links[0]).toHaveTextContent(`Due ${formatDashboardDate(firstAction.dueDate)}`);
		expect(links[0]).toHaveTextContent(formatCurrency(firstAction.impactCents));
		expect(links[0]).toHaveAttribute("href", "/demo/workspace/invoices");
		expect(links[1]).toHaveAttribute("href", "/demo/workspace/approvals");
		expect(links[2]).toHaveAttribute("href", "/demo/workspace/vendors");
	});
});
