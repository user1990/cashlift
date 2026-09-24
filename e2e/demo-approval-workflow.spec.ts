import { expect, test } from "@playwright/test";
import { delaySpendRequestPatch } from "./playwright/spendRequestRoutes";

test.describe("demo workspace approvals", () => {
	test.beforeEach(async ({ page }) => {
		await delaySpendRequestPatch(page);
		await page.goto("/dashboard/approvals");
	});

	test("approves a pending spend request and locks conflicting controls while pending", async ({ page }) => {
		const approveBrandForge = page.getByRole("button", { name: "Approve BrandForge" });
		const rejectDelta = page.getByRole("button", { name: "Reject Delta" });

		await expect(approveBrandForge).toBeVisible();
		await expect(rejectDelta).toBeEnabled();

		await approveBrandForge.click();

		await expect(rejectDelta).toBeDisabled();

		await expect(page.getByText("Spend approved", { exact: true })).toBeVisible({ timeout: 15_000 });
	});
});
