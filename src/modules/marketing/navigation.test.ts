import { describe, expect, it } from "vitest";
import { MARKETING_NAV_GROUPS } from "./navigation";

describe("MARKETING_NAV_GROUPS", () => {
	it("labels the walkthrough route consistently", () => {
		const productNavigation = MARKETING_NAV_GROUPS.find((group) => group.label === "Product")?.items;
		const demoItem = productNavigation?.find((item) => item.href === "/demo");

		expect(demoItem).toEqual({ href: "/demo", label: "Book a walkthrough" });
	});
});
