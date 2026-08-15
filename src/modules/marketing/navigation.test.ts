import { describe, expect, it } from "vitest";
import { MARKETING_NAV_GROUPS } from "./navigation";

describe("MARKETING_NAV_GROUPS", () => {
	it("keeps Demo in the Product navigation", () => {
		const demoItem = MARKETING_NAV_GROUPS.flatMap(({ items }) => items).find(({ href }) => href === "/demo");

		expect(demoItem).toBeDefined();
	});
});
