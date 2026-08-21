import { describe, expect, it } from "vitest";
import { HELP_FAQ_GROUPS } from "./content";
import { filterHelpFaqGroups, parseHelpFaqQuery } from "./utils";

const HELP_FAQ_GROUPS_MOCK = [
	{
		items: [
			{ answer: "Ranked by cash impact.", question: "How does CashLift rank actions?" },
			{
				answer: "Collection, approval, and renewal decisions.",
				question: "What kinds of actions does CashLift surface?",
			},
		],
		name: "How it works",
	},
	{
		items: [{ answer: "The Studio Nova workspace is read-only.", question: "Where does CashLift get its data?" }],
		name: "Demo",
	},
] as const;

describe("parseHelpFaqQuery", () => {
	it("trims valid queries and ignores missing or oversized values", () => {
		expect(parseHelpFaqQuery("  demo  ")).toEqual("demo");
		expect(parseHelpFaqQuery(["workspace", "ignored"])).toEqual("workspace");
		expect(parseHelpFaqQuery(undefined)).toEqual("");
		expect(parseHelpFaqQuery("x".repeat(121))).toEqual("");
	});
});

describe("filterHelpFaqGroups", () => {
	it("keeps the full catalog until a query matches questions, answers, or group names", () => {
		expect(filterHelpFaqGroups(HELP_FAQ_GROUPS_MOCK, "")).toEqual([...HELP_FAQ_GROUPS_MOCK]);

		expect(filterHelpFaqGroups(HELP_FAQ_GROUPS_MOCK, "studio nova")).toEqual([
			{
				items: [{ answer: "The Studio Nova workspace is read-only.", question: "Where does CashLift get its data?" }],
				name: "Demo",
			},
		]);

		expect(filterHelpFaqGroups(HELP_FAQ_GROUPS_MOCK, "how it works")).toEqual([HELP_FAQ_GROUPS_MOCK[0]]);
		expect(filterHelpFaqGroups(HELP_FAQ_GROUPS_MOCK, "payroll")).toEqual([]);
		expect(filterHelpFaqGroups(HELP_FAQ_GROUPS, "cash action").length).toBeGreaterThan(0);
	});
});
