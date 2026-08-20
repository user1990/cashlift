// @vitest-environment jsdom

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, it } from "vitest";
import { DEMO_WORKSPACE_DATASET } from "@/modules/workspace/demoDataset";
import { buildDashboardViewModel } from "../view-model";
import { ExplorePrototype } from "./ExplorePrototype";

describe("ExplorePrototype", () => {
	const dashboard = buildDashboardViewModel({
		dataset: DEMO_WORKSPACE_DATASET,
		date: new Date("2024-05-20T00:00:00"),
		role: "owner-finance",
	});

	const renderPrototype = () =>
		render(
			<NuqsTestingAdapter hasMemory>
				<ExplorePrototype dataset={DEMO_WORKSPACE_DATASET} />
			</NuqsTestingAdapter>,
		);

	it("renders the liquid-glass cockpit from the current dataset", () => {
		renderPrototype();

		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(dashboard.cashPositionHeadline);
		expect(screen.getByText(`${dashboard.runwayDays} days runway`)).toBeVisible();
		expect(screen.getByText("Cash buffer")).toBeVisible();
		expect(screen.getByRole("heading", { name: dashboard.actionInbox[0]?.title })).toBeVisible();
		expect(screen.getByRole("heading", { name: "13-week Cash Outlook" })).toBeVisible();
		expect(screen.getByRole("combobox", { name: /search company workspace/i })).toBeVisible();
		expect(within(screen.getByRole("group", { name: "Glass card look" })).getAllByRole("button")).toHaveLength(5);
		expect(screen.getByRole("button", { name: "Liquid" })).toHaveAttribute("aria-pressed", "true");
	});

	it("switches glass card looks from the prototype header", async () => {
		const user = userEvent.setup();

		renderPrototype();

		await user.click(screen.getByRole("button", { name: "Frost" }));

		expect(screen.getByRole("button", { name: "Frost" })).toHaveAttribute("aria-pressed", "true");
		expect(screen.getByRole("button", { name: "Liquid" })).toHaveAttribute("aria-pressed", "false");
		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(dashboard.cashPositionHeadline);

		await user.click(screen.getByRole("button", { name: "Soft" }));

		expect(screen.getByRole("button", { name: "Soft" })).toHaveAttribute("aria-pressed", "true");
		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(dashboard.cashPositionHeadline);
	});

	it("finds workspace items from the header search and filters", async () => {
		const user = userEvent.setup();

		renderPrototype();

		const search = screen.getByRole("combobox", { name: /search company workspace/i });

		await user.click(search);
		await user.paste("Aurora");

		await waitFor(() => {
			expect(screen.getAllByRole("link", { name: /aurora health/i }).map((link) => link.getAttribute("href"))).toEqual([
				"/dashboard/invoices",
				"/dashboard/invoices",
			]);
		});

		await user.click(screen.getByRole("button", { name: "Clear all" }));

		await waitFor(() => {
			expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(dashboard.cashPositionHeadline);
		});

		await user.click(search);
		await user.paste("zzzz");

		expect(screen.getByText("No results")).toBeVisible();

		await user.click(screen.getByRole("button", { name: "Reset search" }));

		await waitFor(() => {
			expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(dashboard.cashPositionHeadline);
		});

		await user.click(screen.getByRole("button", { name: /collect/i }));
		await user.click(screen.getByRole("button", { name: /^overdue$/i }));

		await waitFor(() => {
			expect(screen.getAllByRole("link", { name: /aurora health/i }).map((link) => link.getAttribute("href"))).toEqual([
				"/dashboard/invoices",
			]);
		});
	});
});
