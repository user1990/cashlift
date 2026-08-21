// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HelpFaqCatalog } from "./HelpFaqCatalog";

const HELP_FAQ_GROUPS_MOCK = [
	{
		items: [
			{ answer: "Ranked by cash impact.", question: "How does CashLift rank actions?" },
			{
				answer: "Collection, approval, and renewal decisions.",
				question: "What kinds of actions does CashLift surface?",
			},
		],
		name: "How it works",
	},
	{
		items: [{ answer: "The Studio Nova workspace is read-only.", question: "Where does CashLift get its data?" }],
		name: "Demo",
	},
] as const;

describe("HelpFaqCatalog", () => {
	it("filters grouped questions, restores the catalog, and keeps an empty state", async () => {
		const user = userEvent.setup();

		render(<HelpFaqCatalog groups={HELP_FAQ_GROUPS_MOCK} query="" />);

		expect(screen.getByText("3 questions")).toBeInTheDocument();
		expect(screen.getByRole("columnheader", { name: "Question" })).toBeInTheDocument();
		expect(screen.getByText("How it works")).toBeInTheDocument();
		expect(screen.getByText("Demo")).toBeInTheDocument();

		await user.type(screen.getByRole("searchbox", { name: "Filter questions" }), "studio");

		expect(screen.getByText("1 question")).toBeInTheDocument();
		expect(screen.getByText("Where does CashLift get its data?")).toBeInTheDocument();
		expect(screen.queryByText("How does CashLift rank actions?")).not.toBeInTheDocument();
		expect(window.location.search).toBe("?q=studio");

		await user.click(screen.getByRole("button", { name: "Clear" }));

		expect(screen.getByText("3 questions")).toBeInTheDocument();
		expect(screen.getByText("How does CashLift rank actions?")).toBeInTheDocument();
		expect(window.location.search).toBe("");

		await user.type(screen.getByRole("searchbox", { name: "Filter questions" }), "payroll");

		expect(screen.getByText("0 questions")).toBeInTheDocument();
		expect(screen.getByText("No questions match this filter.")).toBeInTheDocument();
	});
});
