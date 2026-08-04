import { expect, test } from "@playwright/test";

test.describe("workspace dataset API contract", () => {
	test("returns only approval data for the approvals scope", async ({ request }) => {
		const response = await request.get("/api/workspace/dataset?scope=approvals");

		expect(response.ok()).toBe(true);
		await expect(response.json()).resolves.toMatchObject({
			cashActions: [],
			forecast: [],
			invoices: [],
			profile: { companyId: "cashlift-demo" },
			spendRequests: expect.arrayContaining([expect.objectContaining({ id: "request-webcam" })]),
			subscriptions: [],
			teamBudgets: [],
			teamMembers: [],
			vendorBills: [],
		});
	});

	test("rejects an impossible workspace date", async ({ request }) => {
		const response = await request.get("/api/workspace/dataset?startDate=2026-02-01&endDate=2026-02-30");

		expect(response.status()).toBe(400);
		await expect(response.json()).resolves.toEqual({
			code: "api_request_failed",
			error: "Workspace dataset date range is invalid.",
		});
	});
});
