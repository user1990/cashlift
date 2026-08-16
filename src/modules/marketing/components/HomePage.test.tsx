// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomePage } from "./HomePage";

const HOME_ACTIONS_MOCK = [
	{
		description: "Collection context",
		impact: "$126,500",
		owner: "Samira Chen",
		priority: "critical",
		title: "Collect Aurora Health before buffer risk",
		type: "collect",
	},
	{
		description: "Approval context",
		impact: "$380",
		owner: "Samira Chen",
		priority: "high",
		title: "Decide on Client Delivery hardware",
		type: "approve",
	},
	{
		description: "Renewal context",
		impact: "$13,200",
		owner: "Finance",
		priority: "medium",
		title: "Cancel Notion trial seats",
		type: "cut",
	},
] as const;

describe("HomePage", () => {
	it("routes demo calls to action and shows the ranked cash decisions", () => {
		render(<HomePage actions={[...HOME_ACTIONS_MOCK]} />);

		expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);

		const demoLinks = screen.getAllByRole("link", { name: "Open live demo" });

		expect(demoLinks).toHaveLength(2);
		expect(demoLinks[0]).toHaveAttribute("href", "/demo/workspace");
		expect(demoLinks[1]).toHaveAttribute("href", "/demo/workspace");
		expect(screen.getAllByRole("heading", { level: 3 }).map(({ textContent }) => textContent)).toEqual(
			HOME_ACTIONS_MOCK.map((action) => action.type),
		);
		expect(screen.getByText(HOME_ACTIONS_MOCK[0].title, { exact: false })).toBeVisible();
		expect(screen.getByText(HOME_ACTIONS_MOCK[0].impact)).toBeVisible();
		expect(screen.getByText(HOME_ACTIONS_MOCK[1].title, { exact: false })).toBeVisible();
		expect(screen.getByText(HOME_ACTIONS_MOCK[1].impact)).toBeVisible();
		expect(screen.getByText(HOME_ACTIONS_MOCK[2].title, { exact: false })).toBeVisible();
		expect(screen.getByText(HOME_ACTIONS_MOCK[2].impact)).toBeVisible();
	});
});
