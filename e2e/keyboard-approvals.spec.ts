import { expect, test } from "@playwright/test";
import { delaySpendRequestPatch } from "./playwright/spendRequestRoutes";

test.describe("keyboard approvals", () => {
	test.beforeEach(async ({ page }) => {
		await delaySpendRequestPatch(page);
		await page.goto("/dashboard/approvals");
	});

	test("activates approve with keyboard focus", async ({ page }) => {
		const approveBrandForge = page.getByRole("button", { name: "Approve BrandForge" });

		await approveBrandForge.focus();
		await expect(approveBrandForge).toBeFocused();

		await page.keyboard.press("Enter");

		await expect(page.getByText("Spend approved", { exact: true })).toBeVisible({ timeout: 15_000 });
	});
});
