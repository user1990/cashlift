import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const assertNoCriticalViolations = (violations: Array<{ impact?: string | null }>) => {
	const critical = violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious");

	expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
};

test.describe("axe smoke", () => {
	test("marketing home has no serious or critical axe violations", async ({ page }) => {
		await page.goto("/");
		await expect(page.locator("h1, h2, h3, h4, h5, h6").first()).toHaveJSProperty("tagName", "H1");

		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		assertNoCriticalViolations(accessibilityScanResults.violations);
	});

	test("demo page has no serious or critical axe violations", async ({ page }) => {
		await page.goto("/demo");

		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		assertNoCriticalViolations(accessibilityScanResults.violations);
	});

	test("app shell renders for axe (demo mode)", async ({ page }) => {
		await page.goto("/app");

		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		assertNoCriticalViolations(accessibilityScanResults.violations);
	});
});
