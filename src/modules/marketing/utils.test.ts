import { describe, expect, it } from "vitest";
import { HELP_FAQ_GROUPS } from "./content";
import { filterHelpFaqGroups, parseHelpFaqQuery } from "./utils";

describe("parseHelpFaqQuery", () => {
	it("preserves bounded input while dropping values longer than 120 characters", () => {
		expect(parseHelpFaqQuery("  demo  ")).toBe("  demo  ");
		expect(parseHelpFaqQuery("x".repeat(121))).toBe("x".repeat(120));
	});
});

describe("filterHelpFaqGroups", () => {
	it("filters grouped FAQs by normalized terms and returns every item for an empty query", () => {
		expect(filterHelpFaqGroups(HELP_FAQ_GROUPS, "")).toEqual(HELP_FAQ_GROUPS);
		expect(filterHelpFaqGroups(HELP_FAQ_GROUPS, "read-only").map(({ name }) => name)).toEqual(["Demo"]);
		expect(filterHelpFaqGroups(HELP_FAQ_GROUPS, "cash impact")[0]?.items).toHaveLength(2);
		expect(filterHelpFaqGroups(HELP_FAQ_GROUPS, "plans")[0]?.items).toHaveLength(2);
		expect(filterHelpFaqGroups(HELP_FAQ_GROUPS, "  demo   financial  ")[0]?.items).toHaveLength(1);
		expect(filterHelpFaqGroups(HELP_FAQ_GROUPS, "financial demo")[0]?.items).toHaveLength(1);
	});
});
