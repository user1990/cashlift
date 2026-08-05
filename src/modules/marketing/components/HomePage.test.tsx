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
	it("routes primary CTAs to the demo landing page and live workspace", () => {
		render(<HomePage actions={[...HOME_ACTIONS_MOCK]} />);

		const demoLinks = screen.getAllByRole("link", { name: "Open live demo" });

		expect(demoLinks).toHaveLength(2);
		expect(demoLinks.map((link) => link.getAttribute("href"))).toEqual(["/demo/workspace", "/demo/workspace"]);
	});

	it("keeps a single page title for the marketing story", () => {
		render(<HomePage actions={[...HOME_ACTIONS_MOCK]} />);

		expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
	});

	it("shows the ranked decisions and supporting answers", () => {
		render(<HomePage actions={[...HOME_ACTIONS_MOCK]} />);

		expect(screen.getAllByRole("heading", { level: 3 }).map(({ textContent }) => textContent)).toEqual([
			"collect",
			"approve",
			"cut",
		]);
		expect(screen.getByText("Collect Aurora Health before buffer risk Collection context")).toBeVisible();
		expect(screen.getAllByRole("group")).toHaveLength(10);
		expect(screen.getByText("What kinds of actions does CashLift surface?")).toBeVisible();
		expect(screen.getByText("Does the demo make payments or financial decisions for me?")).toBeVisible();
	});
});
