import { expect, test } from "@playwright/test";

test.describe("homepage decision story", () => {
	test("opens the live demo from home calls to action", async ({ page }) => {
		await page.goto("/");

		await page.locator("main").getByRole("link", { name: "Open live demo" }).first().click();

		await expect(page).toHaveURL(/\/demo\/workspace$/);
		await expect(page.getByText("Read-only demo").first()).toBeVisible();
	});
});
