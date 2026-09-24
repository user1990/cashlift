import { expect, test } from "@playwright/test";

test.describe("demo workspace approvals", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/dashboard/approvals");
	});

	test("approves a pending spend request in the demo workspace", async ({ page }) => {
		const approveBrandForge = page.getByRole("button", { name: "Approve BrandForge" });

		await approveBrandForge.scrollIntoViewIfNeeded();
		await expect(approveBrandForge).toBeVisible();
		await approveBrandForge.click();

		await expect(page.getByText(/Spend approved/)).toBeVisible({ timeout: 15_000 });
	});
});
