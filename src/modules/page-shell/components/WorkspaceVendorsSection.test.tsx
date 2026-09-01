// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { formatPreciseCompactCurrency } from "@/modules/money/format";
import { getVendorLeakSavings } from "@/modules/subscriptions/utils";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { WorkspaceVendorsSection } from "./WorkspaceVendorsSection";

describe("WorkspaceVendorsSection", () => {
	it("renders leak-first cockpit copy and both vendor bills and leaks from the dataset", () => {
		const leakSavingsCents = getVendorLeakSavings(financialDatasetFixture.subscriptions);

		render(<WorkspaceVendorsSection dataset={financialDatasetFixture} />);

		expect(
			screen.getByRole("heading", {
				level: 1,
				name: `${formatPreciseCompactCurrency(leakSavingsCents)} in monthly vendor leak savings`,
			}),
		).toBeVisible();
		expect(screen.getByRole("heading", { name: "Notion" })).toBeVisible();
		expect(screen.getByRole("heading", { name: "Vendor leaks" })).toBeVisible();
		expect(screen.getByRole("heading", { name: "Vendor bills" })).toBeVisible();
		expect(screen.getByText("MeetingAI")).toBeVisible();
		expect(screen.getByText("SurveyStack")).toBeVisible();
		expect(screen.getByText("Studio lease extras")).toBeVisible();
		expect(screen.getByText("Freelance bench")).toBeVisible();
		expect(screen.getByText("Payroll run")).toBeVisible();
		expect(screen.getByText("BrandForge")).toBeVisible();
		expect(screen.queryByRole("link", { name: /leak audit/i })).not.toBeInTheDocument();
	});

	it("explains when no vendor leaks or vendor bills need action", () => {
		render(
			<WorkspaceVendorsSection
				dataset={{
					...financialDatasetFixture,
					subscriptions: [],
					vendorBills: [],
				}}
			/>,
		);

		expect(
			screen.getByRole("heading", { level: 1, name: "No vendor leaks or vendor bills need action" }),
		).toBeVisible();
		expect(screen.getByText("No vendor leaks need action.")).toBeVisible();
		expect(screen.getByText("No vendor bills in this workspace.")).toBeVisible();
		expect(screen.queryByText("Notion")).not.toBeInTheDocument();
	});
});
