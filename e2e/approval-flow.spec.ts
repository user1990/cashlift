import { expect, test } from "@playwright/test";

test.describe("demo approval flow", () => {
	test("approves the pending demo spend request", async ({ page, request }) => {
		await page.goto("/dashboard/approvals");

		await expect(page.getByRole("heading", { name: "Spend approvals" })).toBeVisible();
		await expect(page.getByText("Logitech")).toBeVisible();

		const response = await request.patch("/api/workspace/spend-requests/request-webcam", {
			data: { status: "approved" },
		});

		expect(response.ok()).toBe(true);
		await expect(response.json()).resolves.toMatchObject({
			id: "request-webcam",
			status: "approved",
			vendor: "Logitech",
		});
	});
});
