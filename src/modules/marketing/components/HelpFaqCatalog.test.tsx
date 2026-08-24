// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { HELP_FAQ_GROUPS } from "../content";
import { HelpFaqCatalog } from "./HelpFaqCatalog";

describe("HelpFaqCatalog", () => {
	beforeEach(() => {
		window.history.replaceState(null, "", "/help");
	});

	it("opens the palette, filters results, and persists q in the URL", async () => {
		const user = userEvent.setup();

		expect(HELP_FAQ_GROUPS.every(({ icon }) => typeof icon === "string")).toBe(true);

		render(<HelpFaqCatalog groups={HELP_FAQ_GROUPS} />);

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "Open Help search" }));

		const search = screen.getByRole("combobox", { name: "Search Help FAQs" });
		expect(screen.getByRole("dialog", { name: "Search Help FAQs" })).toBeInTheDocument();
		expect(search).toHaveAttribute("type", "text");
		expect(search).toHaveAttribute("aria-expanded", "true");
		expect(screen.getByRole("button", { name: "Close Help search" })).toHaveAttribute("title", "Close Help search");

		await user.type(search, "read-only");

		expect(screen.getByText("Can I try the demo with real company data?")).toBeVisible();
		expect(screen.getByText("3 answers")).toBeVisible();
		expect(window.location.search).toBe("?q=read-only");
	});

	it("highlights matching questions and answers while filtering the catalog", async () => {
		const user = userEvent.setup();

		render(<HelpFaqCatalog groups={HELP_FAQ_GROUPS} />);
		await user.click(screen.getByRole("button", { name: "Open Help search" }));

		await user.type(screen.getByRole("combobox", { name: "Search Help FAQs" }), "demo");

		expect(screen.getAllByText("demo", { exact: true }).length).toBeGreaterThan(0);
	});

	it("supports keyboard selection and reveals the selected answer", async () => {
		const user = userEvent.setup();

		render(<HelpFaqCatalog groups={HELP_FAQ_GROUPS} />);

		await user.click(screen.getByRole("button", { name: "Open Help search" }));
		await user.keyboard("{ArrowDown}{Enter}");

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "What kinds of decisions does CashLift surface?" })).toBeVisible();
		expect(screen.getByText(/CashLift ranks approvals, collections, vendor leaks/)).toBeVisible();
	});

	it("opens with a shared URL query", () => {
		window.history.replaceState(null, "", "/help?q=pricing");

		render(<HelpFaqCatalog groups={HELP_FAQ_GROUPS} initialQuery="pricing" />);

		expect(screen.getByRole("dialog", { name: "Search Help FAQs" })).toBeInTheDocument();
		expect(screen.getByRole("combobox", { name: "Search Help FAQs" })).toHaveValue("pricing");
	});

	it("keeps the palette keyboard-accessible and preserves a no-results query", async () => {
		const user = userEvent.setup();

		render(<HelpFaqCatalog groups={HELP_FAQ_GROUPS} />);
		await user.click(screen.getByRole("button", { name: "Open Help search" }));

		const search = screen.getByRole("combobox", { name: "Search Help FAQs" });
		expect(search).toHaveFocus();

		await user.type(search, "unmatchedterm");
		expect(screen.getByRole("heading", { name: "No results for “unmatchedterm”" })).toBeVisible();

		await user.keyboard("{Enter}");
		expect(search).toHaveValue("");

		await user.tab();
		expect(screen.getByRole("button", { name: "Close Help search" })).toHaveFocus();

		await user.keyboard("{Escape}");
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("keeps the contact panel in the help flow", () => {
		render(<HelpFaqCatalog groups={HELP_FAQ_GROUPS} />);

		expect(screen.getByRole("heading", { name: "Still need help?" })).toBeVisible();
		expect(screen.getByRole("link", { name: "Contact us" })).toHaveAttribute("href", "/contact");
		expect(screen.getByRole("button", { name: "Open Help search" })).toBeVisible();
	});
});
