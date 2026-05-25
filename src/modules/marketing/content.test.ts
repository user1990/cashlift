import { describe, expect, it } from "vitest";
import { DEFAULT_PRICING_PLAN_SLUG, getPricingPlanBySlug } from "./content";

describe("getPricingPlanBySlug", () => {
	it("returns matching pricing plans", () => {
		expect(getPricingPlanBySlug("control").name).toEqual("Control");
		expect(getPricingPlanBySlug("command").name).toEqual("Command");
		expect(getPricingPlanBySlug("scale").name).toEqual("Scale");
	});

	it("falls back to the default pricing plan", () => {
		expect(getPricingPlanBySlug(undefined).slug).toEqual(DEFAULT_PRICING_PLAN_SLUG);
		expect(getPricingPlanBySlug("unknown").slug).toEqual(DEFAULT_PRICING_PLAN_SLUG);
	});
});
