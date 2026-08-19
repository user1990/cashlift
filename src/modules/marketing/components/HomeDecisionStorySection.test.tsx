// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeDecisionStorySection } from "./HomeDecisionStorySection";

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

describe("HomeDecisionStorySection", () => {
	it("shows ranked cash decisions in priority order", () => {
		render(<HomeDecisionStorySection actions={[...HOME_ACTIONS_MOCK]} />);

		expect(screen.getAllByRole("heading", { level: 3 }).map(({ textContent }) => textContent)).toEqual(
			HOME_ACTIONS_MOCK.map((action) => action.type),
		);
	});
});
