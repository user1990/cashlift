import { expect, test } from "@playwright/test";

test.describe("homepage decision story", () => {
	test("opens the public demo and booking form from truthful calls to action", async ({ page }) => {
		await page.goto("/");

		await expect(page.getByRole("heading", { level: 1 })).toHaveText("See what to collect, approve, or cut today.");

		await page.locator("main").getByRole("link", { name: "Open live demo" }).click();
		await expect(page).toHaveURL(/\/demo\/workspace$/);
		await expect(page.getByText("Read-only demo").first()).toBeVisible();

		await page.goto("/");
		await page.getByRole("link", { name: "Book an audit walkthrough" }).click();
		await expect(page).toHaveURL(/\/demo$/);
		await expect(
			page.getByRole("heading", {
				level: 1,
				name: "See the cash leak. Understand the impact. Know what to do next.",
			}),
		).toBeVisible();
	});
});
