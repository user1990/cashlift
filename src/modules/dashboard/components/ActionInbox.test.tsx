// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { formatCurrency, getPercentage } from "@/modules/money/format";
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
		const auroraInvoice = DEMO_WORKSPACE_DATASET.invoices.find(({ id }) => id === "invoice-aurora-health");

		if (firstAction === undefined) {
			throw new Error("demo inbox must include a ranked action");
		}

		if (auroraInvoice === undefined) {
			throw new Error("demo dataset must include the Aurora Health invoice");
		}

		render(<ActionInbox actions={dashboard.actionInbox} basePath="/demo/workspace" />);

		const links = screen.getAllByRole("link");

		expect(dashboard.actionInbox.map((action) => action.id)).toEqual([
			"action-collect-aurora",
			"action-approve-webcam",
			"action-cut-notion",
		]);
		expect(firstAction.description).toContain(formatCurrency(auroraInvoice.amountCents));
		expect(firstAction.description).toContain(getPercentage(auroraInvoice.collectionProbability));
		expect(links.map((link) => link.getAttribute("href"))).toEqual([
			"/demo/workspace/invoices",
			"/demo/workspace/approvals",
			"/demo/workspace/vendors",
		]);
		expect(links[0]).toHaveTextContent(`Due ${formatDashboardDate(firstAction.dueDate)}`);
		expect(links[0]).toHaveTextContent(formatCurrency(firstAction.impactCents));
		expect(links[0]).toHaveTextContent(firstAction.description);
	});
});
