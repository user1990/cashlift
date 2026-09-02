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

		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(formatPreciseCompactCurrency(leakSavingsCents));
		expect(screen.getByRole("heading", { name: "Notion" })).toBeVisible();
		expect(screen.getByText("MeetingAI")).toBeVisible();
		expect(screen.getByText("SurveyStack")).toBeVisible();
		expect(screen.getByText("Studio lease extras")).toBeVisible();
		expect(screen.getByText("Freelance bench")).toBeVisible();
		expect(screen.getByText("Payroll run")).toBeVisible();
		expect(screen.getByText("BrandForge")).toBeVisible();
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

		expect(screen.queryByText("Notion")).not.toBeInTheDocument();
		expect(screen.queryByText("Studio lease extras")).not.toBeInTheDocument();
	});
});
