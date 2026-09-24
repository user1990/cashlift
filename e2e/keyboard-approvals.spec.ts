import { expect, test } from "@playwright/test";

test.describe("keyboard approvals", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/dashboard/approvals");
	});

	test("activates approve with keyboard focus", async ({ page }) => {
		const approveBrandForge = page.getByRole("button", { name: "Approve BrandForge" });

		await approveBrandForge.scrollIntoViewIfNeeded();
		await approveBrandForge.focus();
		await expect(approveBrandForge).toBeFocused();

		await approveBrandForge.press("Enter");

		await expect(page.getByText(/Spend approved/)).toBeVisible({ timeout: 15_000 });
	});
});
