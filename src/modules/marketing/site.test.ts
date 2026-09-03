import { describe, expect, it } from "vitest";
import { HELP_FAQ_GROUPS, PRODUCT } from "./site";

describe("marketing site copy", () => {
	it("keeps help FAQ slugs unique", () => {
		const slugs = HELP_FAQ_GROUPS.flatMap((group) => group.items.map((item) => item.slug));

		expect(new Set(slugs).size).toBe(slugs.length);
	});

	it("states the approved product boundaries", () => {
		expect(PRODUCT.not).toContain("move money");
		expect(PRODUCT.vocabulary.avoid).toContain("command center");
	});
});
