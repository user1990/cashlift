import { expect, test } from "@playwright/test";

test.describe("homepage decision story", () => {
	test("opens the live demo from home calls to action", async ({ page }) => {
		await page.goto("/");

		await expect(page.getByRole("heading", { level: 1 })).toHaveText("See what to collect, approve, or cut today.");
		await expect(page.getByRole("heading", { name: "Your cash decisions" })).toBeVisible();

		const demoLinks = page.locator("main").getByRole("link", { name: "Open live demo" });

		await expect(demoLinks).toHaveCount(2);

		await demoLinks.first().click();
		await expect(page).toHaveURL(/\/demo\/workspace$/);
		await expect(page.getByText("Read-only demo").first()).toBeVisible();

		await page.goto("/");
		await demoLinks.nth(1).click();
		await expect(page).toHaveURL(/\/demo\/workspace$/);
		await expect(page.getByText("Read-only demo").first()).toBeVisible();
	});
});
