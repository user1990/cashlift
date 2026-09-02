import { expect, test } from "@playwright/test";

test.describe("homepage decision story", () => {
	test("tracks desktop hero pointer tilt without a long animation chase", async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 });
		await page.emulateMedia({ reducedMotion: "no-preference" });
		await page.goto("/");

		const heroImage = page.getByRole("figure");
		await heroImage.scrollIntoViewIfNeeded();
		const bounds = await heroImage.boundingBox();
		expect(bounds).not.toBeNull();
		if (!bounds) return;

		await page.mouse.move(bounds.x + bounds.width * 0.2, bounds.y + bounds.height * 0.4);
		await page.waitForTimeout(50);
		const firstState = await heroImage.evaluate((element) => ({
			transform: getComputedStyle(element).transform,
			duration: Number(element.getAnimations()[0]?.effect?.getTiming().duration),
		}));

		await page.mouse.move(bounds.x + bounds.width * 0.8, bounds.y + bounds.height * 0.6);
		await page.waitForTimeout(50);
		const secondState = await heroImage.evaluate((element) => ({
			transform: getComputedStyle(element).transform,
			duration: Number(element.getAnimations()[0]?.effect?.getTiming().duration),
		}));

		expect(firstState.duration).toBeLessThanOrEqual(16);
		expect(secondState.duration).toBeLessThanOrEqual(16);
		expect(firstState.transform).not.toBe(secondState.transform);
	});

	test("opens the live demo from home calls to action", async ({ page }) => {
		await page.goto("/");

		await page.locator("main").getByRole("link", { name: "Open live demo" }).first().click();

		await expect(page).toHaveURL(/\/demo\/workspace$/);
		await expect(page.locator("aside > p").filter({ hasText: "Read-only demo" })).toBeVisible();
	});
});
