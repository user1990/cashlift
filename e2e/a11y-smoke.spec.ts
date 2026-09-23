import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

type AccessibilityViolation = {
	id: string;
	impact?: string | null;
};

const assertNoCriticalViolations = (violations: AccessibilityViolation[]) => {
	const critical = violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious");

	expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
};

const assertNoUnnamedLinks = (violations: AccessibilityViolation[]) => {
	const unnamedLinks = violations.filter((violation) => violation.id === "link-name");

	expect(unnamedLinks, JSON.stringify(unnamedLinks, null, 2)).toEqual([]);
};

test.describe("axe smoke", () => {
	test("marketing home has no serious or critical axe violations", async ({ page }) => {
		await page.goto("/");

		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		assertNoCriticalViolations(accessibilityScanResults.violations);
		assertNoUnnamedLinks(accessibilityScanResults.violations);
	});

	test("demo page has no serious or critical axe violations", async ({ page }) => {
		await page.goto("/demo");

		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		assertNoCriticalViolations(accessibilityScanResults.violations);
		assertNoUnnamedLinks(accessibilityScanResults.violations);
	});

	test("checkout has no serious or critical axe violations", async ({ page }) => {
		await page.goto("/checkout");

		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		assertNoCriticalViolations(accessibilityScanResults.violations);
		assertNoUnnamedLinks(accessibilityScanResults.violations);
	});

	test("checkout fits within a 320px viewport", async ({ page }) => {
		await page.setViewportSize({ height: 800, width: 320 });
		await page.goto("/checkout");

		const overflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

		expect(overflow).toBe(true);
	});

	test("skip links land inside main content", async ({ page }) => {
		for (const path of ["/checkout", "/demo/workspace"]) {
			await page.goto(path);
			await page.getByRole("link", { name: "Skip to content" }).click();
			await page.keyboard.press("Tab");

			const activeInMain = await page.evaluate(() => {
				const main = document.getElementById("main-content");
				const active = document.activeElement;

				return Boolean(main && active && main.contains(active));
			});

			expect(activeInMain, `skip link target for ${path}`).toBe(true);
		}
	});

	test("app shell renders for axe (demo mode)", async ({ page }) => {
		await page.goto("/dashboard");

		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		assertNoCriticalViolations(accessibilityScanResults.violations);
		assertNoUnnamedLinks(accessibilityScanResults.violations);
	});
});
