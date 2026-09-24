import { expect, test } from "@playwright/test";

test.describe("demo workspace approvals", () => {
	test("approves a pending spend request and locks conflicting controls while pending", async ({ page }) => {
		await page.route("**/api/**/spend-requests/**", async (route) => {
			if (route.request().method() !== "PATCH") {
				await route.continue();

				return;
			}

			await new Promise((resolve) => {
				setTimeout(resolve, 1_500);
			});
			await route.continue();
		});

		await page.goto("/dashboard/approvals");
		await page.waitForLoadState("networkidle");

		const approveBrandForge = page.getByRole("button", { name: "Approve BrandForge" });
		const rejectDelta = page.getByRole("button", { name: "Reject Delta" });

		await expect(approveBrandForge).toBeVisible();
		await expect(rejectDelta).toBeVisible();

		await approveBrandForge.click();

		await expect(approveBrandForge).toBeDisabled();
		await expect(rejectDelta).toBeDisabled();

		await expect(page.getByText("Spend approved")).toBeVisible({ timeout: 15_000 });
	});
});
