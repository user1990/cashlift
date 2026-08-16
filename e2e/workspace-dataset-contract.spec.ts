import { expect, test } from "@playwright/test";

test.describe("workspace dataset API contract", () => {
	test("returns only approval data for the approvals scope", async ({ request }) => {
		const response = await request.get("/api/workspace/dataset?scope=approvals");

		expect(response.ok()).toBe(true);
		const body = await response.json();

		expect(body).toMatchObject({
			cashActions: [],
			forecast: [],
			invoices: [],
			profile: { companyId: "cashlift-demo" },
			subscriptions: [],
			teamBudgets: [],
			teamMembers: [],
			vendorBills: [],
		});
		expect(body.spendRequests.length).toBeGreaterThan(0);
	});
});
