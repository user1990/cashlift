import { describe, expect, it } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { getVisibleCashActions } from "./utils";

describe("cash action utils", () => {
	it("sorts visible cash actions by priority for finance users", () => {
		const actions = getVisibleCashActions(financialDatasetFixture.cashActions, "owner-finance");

		expect(actions[0].priority).toEqual("critical");
		expect(actions[0].id).toEqual("action-approval-design-suite");
	});
});
