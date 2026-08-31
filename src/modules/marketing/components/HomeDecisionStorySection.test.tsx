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
	it("shows ranked cash decisions with their titles and impacts", () => {
		render(<HomeDecisionStorySection actions={[...HOME_ACTIONS_MOCK]} />);

		expect(screen.getAllByRole("heading", { level: 3 }).map(({ textContent }) => textContent)).toEqual(
			HOME_ACTIONS_MOCK.map((action) => action.type),
		);
		expect(screen.getByText(HOME_ACTIONS_MOCK[0].title, { exact: false })).toBeInTheDocument();
		expect(screen.getByText(HOME_ACTIONS_MOCK[0].impact)).toBeInTheDocument();
		expect(screen.getByText(HOME_ACTIONS_MOCK[1].title, { exact: false })).toBeInTheDocument();
		expect(screen.getByText(HOME_ACTIONS_MOCK[1].impact)).toBeInTheDocument();
		expect(screen.getByText(HOME_ACTIONS_MOCK[2].title, { exact: false })).toBeInTheDocument();
		expect(screen.getByText(HOME_ACTIONS_MOCK[2].impact)).toBeInTheDocument();
	});
});
