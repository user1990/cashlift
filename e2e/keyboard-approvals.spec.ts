import { expect, test } from "@playwright/test";

test.describe("keyboard approvals", () => {
	test("activates approve with keyboard focus", async ({ page }) => {
		await page.goto("/dashboard/approvals");
		await page.waitForLoadState("networkidle");

		const approveBrandForge = page.getByRole("button", { name: "Approve BrandForge" });
		await approveBrandForge.focus();
		await expect(approveBrandForge).toBeFocused();

		await page.keyboard.press("Enter");

		await expect(page.getByRole("button", { name: "Reject Delta" })).toBeDisabled();
		await expect(page.getByText("Spend approved")).toBeVisible({ timeout: 15_000 });
	});
});
