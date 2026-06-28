import { instant } from "@next/playwright";
import { expect, test } from "@playwright/test";

test.describe("instant dashboard navigation", () => {
	test("shows the approvals shell immediately from the dashboard", async ({ page }) => {
		await page.goto("/dashboard");

		await instant(page, async () => {
			await page.getByRole("link", { name: "Approvals" }).click();
			await expect(page.getByRole("heading", { name: "Spend approvals" })).toBeVisible();
		});
	});

	test("shows the vendors shell immediately from the dashboard", async ({ page }) => {
		await page.goto("/dashboard");

		await instant(page, async () => {
			await page.getByRole("link", { name: "Vendors" }).click();
			await expect(page.getByRole("heading", { name: "Vendor leaks" })).toBeVisible();
		});
	});
});
