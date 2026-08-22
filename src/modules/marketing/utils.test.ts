import { describe, expect, it } from "vitest";
import { HELP_FAQ_GROUPS } from "./content";
import { filterHelpFaqGroups, parseHelpFaqQuery } from "./utils";

describe("parseHelpFaqQuery", () => {
	it("trims a query and drops values longer than 120 characters", () => {
		expect(parseHelpFaqQuery("  demo  ")).toBe("demo");
		expect(parseHelpFaqQuery("x".repeat(121))).toBe("");
	});
});

describe("filterHelpFaqGroups", () => {
	it("matches question, answer, and group names while preserving grouped results", () => {
		expect(filterHelpFaqGroups(HELP_FAQ_GROUPS, "read-only").map(({ name }) => name)).toEqual(["Demo"]);
		expect(filterHelpFaqGroups(HELP_FAQ_GROUPS, "cash impact")[0]?.items).toHaveLength(2);
		expect(filterHelpFaqGroups(HELP_FAQ_GROUPS, "plans")[0]?.items).toHaveLength(2);
	});

	it("returns every item for an empty query", () => {
		expect(filterHelpFaqGroups(HELP_FAQ_GROUPS, "")).toEqual(HELP_FAQ_GROUPS);
	});
});
