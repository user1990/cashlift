// @vitest-environment jsdom

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { formatPreciseCompactCurrency } from "@/modules/money/format";
import { DEMO_WORKSPACE_DATASET } from "@/modules/workspace/demoDataset";
import { buildDashboardViewModel } from "../view-model";
import { DashboardCockpit } from "./DashboardCockpit";

describe("DashboardCockpit", () => {
	beforeEach(() => {
		vi.useFakeTimers({ toFake: ["Date"] });
		vi.setSystemTime(new Date("2024-05-20T00:00:00"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	const dashboard = buildDashboardViewModel({
		dataset: DEMO_WORKSPACE_DATASET,
		date: new Date("2024-05-20T00:00:00"),
		role: "owner-finance",
	});
	const troughCents = dashboard.lowestProjectedCashCents;
	const troughDate = dashboard.lowestProjectedCashDate;
	const [firstAction] = dashboard.actionInbox;

	if (troughCents === undefined || troughDate === undefined) {
		throw new Error("demo outlook must include a trough");
	}

	if (firstAction === undefined) {
		throw new Error("demo inbox must include a ranked action");
	}

	const renderCockpit = () =>
		render(
			<NuqsTestingAdapter hasMemory>
				<DashboardCockpit dataset={DEMO_WORKSPACE_DATASET} />
			</NuqsTestingAdapter>,
		);

	const openFindPalette = async (user: ReturnType<typeof userEvent.setup>) => {
		await user.click(screen.getByRole("button", { name: /search for anything in this workspace/i }));

		return screen.getByRole("combobox", { name: /search company workspace/i });
	};

	it("shows current cash, trough, and inbox action from the dataset", () => {
		renderCockpit();

		expect(screen.getByText(formatPreciseCompactCurrency(dashboard.cashAvailableCents))).toBeVisible();
		expect(screen.getByText(formatPreciseCompactCurrency(dashboard.cashBufferTargetCents))).toBeVisible();
		expect(screen.getByText(formatPreciseCompactCurrency(dashboard.cashAtRiskCents))).toBeVisible();
		expect(
			screen.getByText(
				new RegExp(`lowest week is ${formatPreciseCompactCurrency(troughCents).replace("$", "\\$")} on`, "i"),
			),
		).toBeVisible();
		expect(screen.getByRole("heading", { name: firstAction.title })).toBeVisible();
		expect(screen.getByRole("button", { name: /search for anything in this workspace/i })).toBeVisible();
	});

	it("finds workspace items from the command palette and restores the cockpit", async () => {
		const user = userEvent.setup();

		renderCockpit();

		expect(screen.queryByRole("combobox", { name: /search company workspace/i })).not.toBeInTheDocument();

		const search = await openFindPalette(user);
		const dialog = screen.getByRole("dialog", { name: /search company workspace/i });

		expect(dialog).toBeVisible();

		await user.click(search);
		await user.paste("Aurora");

		await waitFor(() => {
			const invoiceLinks = within(dialog).getAllByRole("link", { name: /aurora health/i });

			expect(invoiceLinks[0]).toHaveAttribute("href", "/dashboard/invoices");
			expect(invoiceLinks[1]).toHaveAttribute("href", "/dashboard/invoices");
			expect(within(dialog).getByRole("listbox")).toBeVisible();
		});

		await user.keyboard("{Escape}");

		await waitFor(() => {
			expect(screen.queryByRole("dialog", { name: /search company workspace/i })).not.toBeInTheDocument();
		});

		const invoiceLinks = screen.getAllByRole("link", { name: /aurora health/i });

		expect(invoiceLinks[0]).toHaveAttribute("href", "/dashboard/invoices");
		expect(invoiceLinks[1]).toHaveAttribute("href", "/dashboard/invoices");

		await user.click(screen.getByRole("button", { name: "Clear all" }));

		await waitFor(() => {
			expect(screen.getByText(formatPreciseCompactCurrency(dashboard.cashAvailableCents))).toBeVisible();
		});

		await openFindPalette(user);
		const openDialog = screen.getByRole("dialog", { name: /search company workspace/i });

		await user.click(screen.getByRole("combobox", { name: /search company workspace/i }));
		await user.paste("zzzz");

		await waitFor(() => {
			expect(within(openDialog).queryByRole("link", { name: /aurora health/i })).not.toBeInTheDocument();
			expect(within(openDialog).queryByRole("listbox")).not.toBeInTheDocument();
			expect(within(openDialog).getByRole("button", { name: "Reset search" })).toBeVisible();
		});

		await user.click(within(openDialog).getByRole("button", { name: "Reset search" }));

		await waitFor(() => {
			expect(within(openDialog).queryByRole("button", { name: "Reset search" })).not.toBeInTheDocument();
		});

		await user.keyboard("{Escape}");

		await waitFor(() => {
			expect(screen.queryByRole("dialog", { name: /search company workspace/i })).not.toBeInTheDocument();
		});

		await user.keyboard("{Meta>}k{/Meta}");

		expect(screen.getByRole("dialog", { name: /search company workspace/i })).toBeVisible();
	});
});
