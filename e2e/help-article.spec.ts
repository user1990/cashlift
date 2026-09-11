import { expect, test } from "@playwright/test";

const REPRESENTATIVE_SLUG = "what-does-cashlift-show-before-a-manager-approves-spend";

test.describe("Help FAQ article prototype", () => {
	test("opens the active article, preserves q on return, and exposes related slugs", async ({ page }) => {
		await page.goto("/help?q=manager%20approves");

		await page.getByRole("combobox", { name: "Search Help FAQs" }).press("Enter");

		await expect(page).toHaveURL(`/help/${REPRESENTATIVE_SLUG}?q=manager%20approves`);
		await expect(page).toHaveTitle(/What does CashLift show before a manager approves spend/);
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
			"href",
			`https://cashlift.vercel.app/help/${REPRESENTATIVE_SLUG}`,
		);
		await expect(page.getByRole("article")).toBeVisible();
		await expect(page.getByRole("heading", { level: 1, name: /What does CashLift show before/ })).toBeVisible();
		await expect(page.getByRole("region", { name: "What it shows" })).toBeVisible();
		await expect(page.getByRole("region", { name: "Why it matters" })).toBeVisible();
		await expect(page.getByRole("region", { name: "Next step" })).toBeVisible();

		await expect(page.getByRole("link", { name: "What context comes with each item?" })).toHaveAttribute(
			"href",
			"/help/what-context-comes-with-each-action?q=manager%20approves",
		);

		await page.getByRole("link", { name: "Back to Help search" }).click();
		await expect(page).toHaveURL("/help?q=manager%20approves");
		await expect(page.getByRole("combobox", { name: "Search Help FAQs" })).toHaveValue("manager approves");
	});

	test("returns a real 404 for an unknown article slug", async ({ page }) => {
		const response = await page.goto("/help/unknown-help-article");

		expect(response?.status()).toBe(404);
	});
});
