import { describe, expect, it } from "vitest";
import {
	DEFAULT_PRICING_PLAN_SLUG,
	getHelpFaqArticleBySlug,
	getHelpFaqItemBySlug,
	getPricingPlanBySlug,
	HELP_FAQ_GROUPS,
} from "./content";

describe("getPricingPlanBySlug", () => {
	it("resolves known slugs and falls back to the default plan", () => {
		expect(getPricingPlanBySlug("starter").slug).toEqual("starter");
		expect(getPricingPlanBySlug("professional").slug).toEqual("professional");
		expect(getPricingPlanBySlug("enterprise").slug).toEqual("enterprise");
		expect(getPricingPlanBySlug(undefined).slug).toEqual(DEFAULT_PRICING_PLAN_SLUG);
		expect(getPricingPlanBySlug("unknown").slug).toEqual(DEFAULT_PRICING_PLAN_SLUG);
	});
});

describe("Help FAQ articles", () => {
	it("keeps FAQ slugs unique and resolves the representative article", () => {
		const items = HELP_FAQ_GROUPS.flatMap(({ items: groupItems }) => groupItems);
		const representativeSlug = "what-does-cashlift-show-before-a-manager-approves-spend";

		expect(new Set(items.map(({ slug }) => slug)).size).toBe(items.length);
		expect(getHelpFaqItemBySlug(representativeSlug)?.question).toBe(
			"What does CashLift show before a manager approves spend?",
		);
		expect(getHelpFaqArticleBySlug(representativeSlug)).toBeDefined();
		expect(getHelpFaqItemBySlug("unknown-help-article")).toBeUndefined();
		expect(getHelpFaqArticleBySlug("unknown-help-article")).toBeUndefined();
	});
});
