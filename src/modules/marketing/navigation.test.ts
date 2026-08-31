import { describe, expect, it } from "vitest";
import { MARKETING_NAV_GROUPS } from "./navigation";

describe("MARKETING_NAV_GROUPS", () => {
	it("keeps the walkthrough route in product navigation", () => {
		expect(MARKETING_NAV_GROUPS.flatMap((group) => group.items.map((item) => item.href))).toContain("/demo");
	});
});
