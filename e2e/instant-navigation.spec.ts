import { instant } from "@next/playwright";
import { expect, type Page, test } from "@playwright/test";

test.describe("instant dashboard navigation", () => {
	test("shows the approvals shell immediately from the dashboard", async ({ page }) => {
		await visitDashboard(page);

		await instant(page, async () => {
			await page
				.getByRole("navigation", { name: "Workspace" })
				.getByRole("link", { name: "Approvals", exact: true })
				.click();
			await expect(page.getByRole("heading", { name: "Spend approvals", exact: true })).toBeVisible();
		});
	});

	test("shows the vendors shell immediately from the dashboard", async ({ page }) => {
		await visitDashboard(page);

		await instant(page, async () => {
			await page
				.getByRole("navigation", { name: "Workspace" })
				.getByRole("link", { name: "Vendors", exact: true })
				.click();
			await expect(page.getByRole("heading", { name: "Vendor leaks", exact: true })).toBeVisible();
		});
	});
});

async function visitDashboard(page: Page) {
	await page.goto("/dashboard");
	await page.waitForLoadState("networkidle");
}
