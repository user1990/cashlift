import { describe, expect, it } from "vitest";
import { DEFAULT_PRICING_PLAN_SLUG, getPricingPlanBySlug } from "./content";

describe("getPricingPlanBySlug", () => {
	it("returns matching pricing plans and prices", () => {
		expect(getPricingPlanBySlug("starter").name).toEqual("Starter");
		expect(getPricingPlanBySlug("starter").price).toEqual("$8");
		expect(getPricingPlanBySlug("professional").name).toEqual("Professional");
		expect(getPricingPlanBySlug("professional").price).toEqual("$25");
		expect(getPricingPlanBySlug("enterprise").name).toEqual("Enterprise");
		expect(getPricingPlanBySlug("enterprise").price).toEqual("$99");
	});

	it("falls back to the default pricing plan", () => {
		expect(getPricingPlanBySlug(undefined).slug).toEqual(DEFAULT_PRICING_PLAN_SLUG);
		expect(getPricingPlanBySlug("unknown").slug).toEqual(DEFAULT_PRICING_PLAN_SLUG);
	});
});
