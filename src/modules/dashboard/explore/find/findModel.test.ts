import { describe, expect, it } from "vitest";
import { DEMO_WORKSPACE_DATASET } from "@/modules/workspace/demoDataset";
import { buildFindItems, filterFindItems } from "./findModel";

describe("find presentation", () => {
	const items = buildFindItems(DEMO_WORKSPACE_DATASET, "/dashboard");

	it("indexes current workspace items and filters without inventing rows", () => {
		const auroraItems = filterFindItems(items, { category: "all", owner: "", query: "Aurora", status: "" }, "work");
		const collectItems = filterFindItems(items, { category: "collect", owner: "", query: "", status: "" }, "work");
		const overdueItems = filterFindItems(items, { category: "all", owner: "", query: "", status: "overdue" }, "kind");
		const missingItems = filterFindItems(items, { category: "all", owner: "", query: "zzzz", status: "" }, "work");

		expect(items.map((item) => item.id).toSorted()).toEqual(
			[
				...DEMO_WORKSPACE_DATASET.cashActions.map((item) => item.id),
				...DEMO_WORKSPACE_DATASET.invoices.map((item) => item.id),
				...DEMO_WORKSPACE_DATASET.spendRequests.map((item) => item.id),
				...DEMO_WORKSPACE_DATASET.subscriptions.map((item) => item.id),
				...DEMO_WORKSPACE_DATASET.vendorBills.map((item) => item.id),
				...DEMO_WORKSPACE_DATASET.teamBudgets.map((item) => item.id),
			].toSorted(),
		);
		expect(auroraItems.map((item) => item.title)).toEqual([
			"Collect Aurora Health before buffer risk",
			"Aurora Health",
		]);
		expect(collectItems.every((item) => item.work === "collect")).toEqual(true);
		expect(overdueItems.map((item) => item.id)).toEqual(["invoice-aurora-health"]);
		expect(missingItems).toEqual([]);
	});
});
