import { describe, expect, it } from "vitest";
import { PRODUCT } from "./site";

describe("marketing site copy", () => {
	it("states the approved product boundaries", () => {
		expect(PRODUCT.not).toContain("move money");
		expect(PRODUCT.vocabulary.avoid).toContain("command center");
	});
});
