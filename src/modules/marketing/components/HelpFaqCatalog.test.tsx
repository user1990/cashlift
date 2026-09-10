// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { getHelpFaqItemBySlug, HELP_FAQ_GROUPS } from "../content";
import { filterHelpFaqGroups, getHelpFaqHref } from "../utils";
import { HelpFaqCatalog } from "./HelpFaqCatalog";

const READ_ONLY_QUERY = "read-only";
const SHARED_QUERY = "approval";
const REPRESENTATIVE_SLUG = "what-does-cashlift-show-before-a-manager-approves-spend";

describe("HelpFaqCatalog", () => {
	beforeEach(() => {
		window.history.replaceState(null, "", "/help");
	});

	it("opens search, filters results, and writes the query into article links", async () => {
		const user = userEvent.setup();
		const matchingItems = filterHelpFaqGroups(HELP_FAQ_GROUPS, READ_ONLY_QUERY).flatMap(({ items }) => items);
		const representativeMatch = matchingItems[0];

		render(<HelpFaqCatalog groups={HELP_FAQ_GROUPS} />);

		expect(screen.getByRole("link", { name: "Contact us" })).toHaveAttribute("href", "/contact");
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "Open Help search" }));

		const search = screen.getByRole("combobox", { name: "Search Help FAQs" });
		expect(screen.getByRole("dialog", { name: "Search Help FAQs" })).toBeInTheDocument();

		await user.type(search, READ_ONLY_QUERY);

		expect(screen.getByRole("option", { name: optionName(representativeMatch.question) })).toHaveAttribute(
			"href",
			getHelpFaqHref(representativeMatch.slug, READ_ONLY_QUERY),
		);
		expect(window.location.search).toBe(`?q=${READ_ONLY_QUERY}`);
	});

	it("opens from a shared query and keeps it on article links until the palette closes", async () => {
		const user = userEvent.setup();
		const representativeQuestion = getHelpFaqItemBySlug(REPRESENTATIVE_SLUG)?.question ?? "";

		window.history.replaceState(null, "", `/help?q=${SHARED_QUERY}`);
		render(<HelpFaqCatalog groups={HELP_FAQ_GROUPS} initialQuery={SHARED_QUERY} />);

		expect(screen.getByRole("dialog", { name: "Search Help FAQs" })).toBeInTheDocument();
		expect(screen.getByRole("combobox", { name: "Search Help FAQs" })).toHaveValue(SHARED_QUERY);
		expect(screen.getByRole("option", { name: optionName(representativeQuestion) })).toHaveAttribute(
			"href",
			getHelpFaqHref(REPRESENTATIVE_SLUG, SHARED_QUERY),
		);

		await user.click(screen.getByRole("button", { name: "Close Help search" }));
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("clears an unmatched query without navigating, then closes on Escape", async () => {
		const user = userEvent.setup();

		render(<HelpFaqCatalog groups={HELP_FAQ_GROUPS} />);
		await user.click(screen.getByRole("button", { name: "Open Help search" }));

		const search = screen.getByRole("combobox", { name: "Search Help FAQs" });
		await user.type(search, "unmatchedterm");

		expect(screen.queryByRole("option")).not.toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Clear search" })).toBeVisible();

		await user.keyboard("{Enter}");
		expect(search).toHaveValue("unmatchedterm");
		expect(screen.queryByRole("dialog")).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "Clear search" }));
		expect(screen.getAllByRole("option").length).toBeGreaterThan(0);

		await user.click(search);
		await user.keyboard("{Escape}");
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});
});

function optionName(question: string) {
	return (accessibleName: string) => accessibleName.includes(question);
}
