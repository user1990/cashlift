import { describe, expect, it } from "vitest";
import { DEFAULT_PRICING_PLAN_SLUG, getPricingPlanBySlug } from "./content";

describe("getPricingPlanBySlug", () => {
	it("resolves known slugs and falls back to the default plan", () => {
		expect(getPricingPlanBySlug("starter").slug).toEqual("starter");
		expect(getPricingPlanBySlug("professional").slug).toEqual("professional");
		expect(getPricingPlanBySlug("enterprise").slug).toEqual("enterprise");
		expect(getPricingPlanBySlug(undefined).slug).toEqual(DEFAULT_PRICING_PLAN_SLUG);
		expect(getPricingPlanBySlug("unknown").slug).toEqual(DEFAULT_PRICING_PLAN_SLUG);
	});
});
