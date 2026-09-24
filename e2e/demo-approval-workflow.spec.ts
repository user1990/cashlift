import { expect, test } from "@playwright/test";
import { delaySpendRequestPatch } from "./playwright/spendRequestRoutes";

test.describe("demo workspace approvals", () => {
	test.beforeEach(async ({ page }) => {
		await delaySpendRequestPatch(page);
		await page.goto("/dashboard/approvals");
	});

	test("approves a pending spend request in the demo workspace", async ({ page }) => {
		const approveBrandForge = page.getByRole("button", { name: "Approve BrandForge" });

		await expect(approveBrandForge).toBeVisible();
		await approveBrandForge.click();

		await expect(page.getByText("Spend approved", { exact: true })).toBeVisible({ timeout: 15_000 });
	});
});
