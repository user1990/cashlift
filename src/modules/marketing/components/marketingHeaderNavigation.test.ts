import { describe, expect, it } from "vitest";
import { MARKETING_NAV_GROUPS } from "./marketingHeaderNavigation";

describe("MARKETING_NAV_GROUPS", () => {
	it("keeps Demo in the Product navigation", () => {
		const productGroup = MARKETING_NAV_GROUPS.find(({ label }) => label === "Product");

		expect(productGroup).toBeDefined();
		expect(productGroup?.items).toContainEqual({ href: "/demo", label: "Demo" });
	});
});
