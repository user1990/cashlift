import { describe, expect, it } from "vitest";
import { MARKETING_NAV_GROUPS } from "./navigation";

describe("MARKETING_NAV_GROUPS", () => {
	it("keeps Demo in the Product navigation", () => {
		const hasDemo = MARKETING_NAV_GROUPS.some((group) => group.items.some((item) => item.href === "/demo"));

		expect(hasDemo).toBe(true);
	});
});
