import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { demoWorkspaceDataset } from "@/modules/workspace/demoDataset";
import { getCashActionDestination } from "../cashActionDestination";
import { buildDashboardViewModel } from "../view-model";
import { ActionInbox } from "./ActionInbox";

describe("ActionInbox", () => {
	it("renders ranked actions with destinations for their decision type", () => {
		const dashboard = buildDashboardViewModel({
			dataset: demoWorkspaceDataset,
			date: new Date("2024-05-20T00:00:00"),
			role: "owner-finance",
		});

		render(<ActionInbox actions={dashboard.actionInbox} basePath="/demo/workspace" />);

		const links = screen.getAllByRole("link");

		expect(links.map((link) => link.textContent)).toEqual([
			expect.stringContaining("Collect Aurora Health before buffer risk"),
			expect.stringContaining("Decide on Client Delivery hardware"),
			expect.stringContaining("Cancel Notion trial seats"),
		]);
		expect(links.map((link) => link.getAttribute("href"))).toEqual([
			"/demo/workspace/invoices",
			"/demo/workspace/approvals",
			"/demo/workspace/vendors",
		]);
	});

	it("renders a complete empty state", () => {
		render(<ActionInbox actions={[]} basePath="/dashboard" />);

		expect(screen.getByText(/clear for today/i)).toBeInTheDocument();
	});

	it.each([
		["approval", "/dashboard/approvals"],
		["collection", "/dashboard/invoices"],
		["vendor-leak", "/dashboard/vendors"],
		["cash-buffer", "/dashboard/cash"],
		["forecast", "/dashboard/cash"],
	] as const)("maps %s actions to %s", (type, destination) => {
		expect(getCashActionDestination(type, "/dashboard")).toBe(destination);
	});
});
