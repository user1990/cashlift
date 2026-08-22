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

	it("filters the same accessible two-column catalog and persists q in the URL", async () => {
		const user = userEvent.setup();

		render(<HelpFaqCatalog groups={HELP_FAQ_GROUPS} />);

		const search = screen.getByRole("textbox", { name: "Search help" });
		expect(screen.getByRole("table", { name: "Help questions and answers" })).toBeInTheDocument();

		await user.type(search, "read-only");

		expect(screen.getByText("Can I try the demo with real company data?")).toBeVisible();
		expect(screen.getByText("2 matches")).toBeVisible();
		expect(window.location.search).toBe("?q=read-only");
	});

	it("switches between labeled visual variants and highlights matching cells", async () => {
		const user = userEvent.setup();

		render(<HelpFaqCatalog groups={HELP_FAQ_GROUPS} />);

		await user.click(screen.getByRole("tab", { name: "2 · Match highlighting" }));
		await user.type(screen.getByRole("textbox", { name: "Search help" }), "demo");

		expect(screen.getAllByText("2 · Match highlighting")[0]).toHaveAttribute("aria-selected", "true");
		expect(document.querySelectorAll("mark").length).toBeGreaterThan(0);

		await user.click(screen.getByRole("tab", { name: "3 · Mobile rows" }));
		expect(screen.getByRole("tab", { name: "3 · Mobile rows" })).toHaveAttribute("aria-selected", "true");
	});

	it("shows the optional contact panel without changing the catalog", async () => {
		const user = userEvent.setup();

		render(<HelpFaqCatalog groups={HELP_FAQ_GROUPS} />);
		await user.click(screen.getByRole("tab", { name: "4 · Contact panel" }));

		expect(screen.getByRole("heading", { name: "Talk through cash ops for your service team." })).toBeVisible();
		expect(screen.getByRole("link", { name: "Contact us" })).toHaveAttribute("href", "/contact");
		expect(screen.getByRole("table", { name: "Help questions and answers" })).toBeInTheDocument();
	});
});
