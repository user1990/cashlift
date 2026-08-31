import { expect, type Page, test } from "@playwright/test";

test.describe("dashboard navigation", () => {
	test("shows the approvals shell immediately from the dashboard", async ({ page }) => {
		await visitDashboard(page);

		await page
			.getByRole("navigation", { name: "Workspace" })
			.getByRole("link", { name: "Spend approvals", exact: true })
			.click();
		await expect(page).toHaveURL(/\/dashboard\/approvals$/);
		await expect(page.getByRole("heading", { name: "Spend approvals", exact: true })).toBeVisible();
	});

	test("shows the vendors shell immediately from the dashboard", async ({ page }) => {
		await visitDashboard(page);

		await page
			.getByRole("navigation", { name: "Workspace" })
			.getByRole("link", { name: "Vendor bills & leaks", exact: true })
			.click();
		await expect(page).toHaveURL(/\/dashboard\/vendors$/);
		await expect(page.getByRole("heading", { name: "Vendor leaks", exact: true })).toBeVisible();
	});
});

async function visitDashboard(page: Page) {
	await page.goto("/dashboard");
	await page.waitForLoadState("networkidle");
}
