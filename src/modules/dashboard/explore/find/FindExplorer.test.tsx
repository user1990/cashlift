// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, it } from "vitest";
import { DEMO_WORKSPACE_DATASET } from "@/modules/workspace/demoDataset";
import { FindExplorer } from "./FindExplorer";

describe("FindExplorer", () => {
	it("finds a current workspace item from search, categories, and filters", async () => {
		const user = userEvent.setup();

		render(
			<NuqsTestingAdapter hasMemory>
				<FindExplorer dataset={DEMO_WORKSPACE_DATASET} direction="c" />
			</NuqsTestingAdapter>,
		);

		const search = screen.getByRole("combobox", { name: /search company workspace/i });

		await user.type(search, "Aurora");

		expect(screen.getAllByRole("link", { name: /aurora health/i }).map((link) => link.getAttribute("href"))).toEqual([
			"/dashboard/invoices",
			"/dashboard/invoices",
		]);
		expect(screen.getByRole("option", { name: "Aurora Health" })).toBeVisible();

		await user.click(screen.getByRole("button", { name: "Clear all" }));
		await user.type(search, "zzzz");

		expect(screen.getByText("No results")).toBeVisible();
		expect(screen.getByText(/no matches for “zzzz”/i)).toBeVisible();

		await user.click(screen.getByRole("button", { name: "Reset search" }));

		expect(screen.getByRole("link", { name: /logitech/i })).toHaveAttribute("href", "/dashboard/approvals");

		await user.click(screen.getByRole("button", { name: /collect/i }));
		await user.click(screen.getByRole("button", { name: /^overdue$/i }));

		expect(screen.getAllByRole("link", { name: /aurora health/i }).map((link) => link.getAttribute("href"))).toEqual([
			"/dashboard/invoices",
		]);
	});
});
