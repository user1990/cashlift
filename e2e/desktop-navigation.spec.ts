import { expect, test } from "@playwright/test";

test.describe("desktop navigation", () => {
	test.beforeEach(async ({ page }) => {
		await page.setViewportSize({ height: 900, width: 1280 });
		await page.goto("/");
	});

	test("supports keyboard disclosure navigation and closes on Escape", async ({ page }) => {
		const navigation = page.getByRole("navigation", { name: "Main navigation" });
		const product = navigation.getByRole("button", { name: "Product" });

		await expect(product).toHaveAttribute("aria-expanded", "false");
		await product.press("Enter");
		await expect(product).toHaveAttribute("aria-expanded", "true");

		await product.press("Tab");
		await expect(navigation.getByRole("link", { name: "Features" })).toBeFocused();

		await page.keyboard.press("Escape");
		await expect(product).toHaveAttribute("aria-expanded", "false");
		await expect(product).toBeFocused();
	});

	test("keeps one popover open and closes on click-away, hover exit, and link selection", async ({ page }) => {
		const navigation = page.getByRole("navigation", { name: "Main navigation" });
		const product = navigation.getByRole("button", { name: "Product" });
		const solutions = navigation.getByRole("button", { name: "Solutions" });

		await product.press("Enter");
		await solutions.press("Enter");
		await expect(product).toHaveAttribute("aria-expanded", "false");
		await expect(solutions).toHaveAttribute("aria-expanded", "true");

		await page.getByRole("heading", { level: 1 }).click();
		await expect(solutions).toHaveAttribute("aria-expanded", "false");

		await product.hover();
		await expect(product).toHaveAttribute("aria-expanded", "true");
		await page.locator("main").hover();
		await expect(product).toHaveAttribute("aria-expanded", "false");

		await product.click();
		await navigation.getByRole("link", { name: "Features" }).click();
		await expect(page).toHaveURL(/\/features$/);
		await expect(navigation.getByRole("button", { name: "Product" })).toHaveAttribute("aria-expanded", "false");
	});
});
