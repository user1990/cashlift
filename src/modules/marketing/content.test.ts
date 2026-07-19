import { describe, expect, it } from "vitest";
import { DEFAULT_PRICING_PLAN_SLUG, getPricingPlanBySlug } from "./content";

describe("getPricingPlanBySlug", () => {
	it("returns matching pricing plans and prices", () => {
		expect(getPricingPlanBySlug("control").name).toEqual("Control");
		expect(getPricingPlanBySlug("control").price).toEqual("$49");
		expect(getPricingPlanBySlug("command").name).toEqual("Command");
		expect(getPricingPlanBySlug("command").price).toEqual("$99");
		expect(getPricingPlanBySlug("scale").name).toEqual("Scale");
		expect(getPricingPlanBySlug("scale").price).toEqual("$199");
	});

	it("falls back to the default pricing plan", () => {
		expect(getPricingPlanBySlug(undefined).slug).toEqual(DEFAULT_PRICING_PLAN_SLUG);
		expect(getPricingPlanBySlug("unknown").slug).toEqual(DEFAULT_PRICING_PLAN_SLUG);
	});
});
