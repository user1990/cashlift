import { expect, type Locator, type Page, test } from "@playwright/test";

test.describe("homepage decision story", () => {
	test("opens the public demo and booking form from truthful calls to action", async ({ page }) => {
		await page.goto("/");

		await expect(page.getByRole("heading", { level: 1 })).toHaveText("See what to collect, approve, or cut today.");
		await expect(page.getByText("Studio Nova demo outcomes · illustrative")).toBeVisible();

		await page.locator("main").getByRole("link", { name: "Open live demo" }).click();
		await expect(page).toHaveURL(/\/demo\/workspace$/);
		await expect(page.getByText("Read-only demo").first()).toBeVisible();

		await page.goto("/");
		await page.getByRole("link", { name: "Book an audit walkthrough" }).click();
		await expect(page).toHaveURL(/\/demo$/);
		await expect(page.getByText("Book an audit walkthrough.", { exact: true })).toBeVisible();
	});

	test("progresses through one sticky product chapter at a time", async ({ page }) => {
		await page.setViewportSize({ height: 900, width: 1280 });
		await page.goto("/");

		const story = page.locator("[data-home-story]");
		const stage = page.locator(".home-story-stage");

		await expect(story).toHaveAttribute("data-enhanced", "true");
		await expect(stage).toHaveCSS("position", "sticky");

		for (const chapter of ["approve", "recover", "cut"]) {
			await page
				.locator(`[data-story-chapter="${chapter}"]`)
				.evaluate((element) => element.scrollIntoView({ block: "center" }));
			await expect(story).toHaveAttribute("data-active-chapter", chapter);
			await expect(page.locator(`[data-story-media="${chapter}"]`)).toHaveCSS("opacity", "1");
		}
	});

	test("stacks complete chapters on mobile without horizontal overflow", async ({ page }) => {
		await page.setViewportSize({ height: 844, width: 390 });
		await page.goto("/");

		await expect(page.locator(".home-story-stage")).toBeHidden();
		await expect(page.locator("[data-story-chapter] img")).toHaveCount(3);
		expect(
			await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
		).toBe(true);
	});

	test("keeps the scroll story still when reduced motion is requested", async ({ page }) => {
		await page.emulateMedia({ reducedMotion: "reduce" });
		await page.goto("/");

		await expect(page.locator('[data-story-media="approve"]')).toHaveCSS("transition-duration", "0s");
	});

	test("keeps every chapter readable when JavaScript is disabled", async ({ browser, baseURL }) => {
		const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
		const page = await context.newPage();

		await page.goto("/");
		await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
		await expect(page.locator("[data-story-chapter]")).toHaveCount(3);
		await expect(page.locator(".home-story-stage")).toHaveCSS("position", "static");

		await context.close();
	});

	test("supports keyboard navigation through the header and homepage calls to action", async ({ page }) => {
		await page.goto("/");
		await focusWithTab(page, page.getByRole("banner").getByRole("link", { name: "Open live demo" }));
		await page.keyboard.press("Enter");
		await expect(page).toHaveURL(/\/demo\/workspace$/);

		await page.goto("/");
		await focusWithTab(page, page.locator("main").getByRole("link", { name: "Open live demo" }));
		await page.keyboard.press("Enter");
		await expect(page).toHaveURL(/\/demo\/workspace$/);

		await page.goto("/");
		await focusWithTab(page, page.getByRole("link", { name: "Book an audit walkthrough" }));
		await page.keyboard.press("Enter");
		await expect(page).toHaveURL(/\/demo$/);
	});
});

test.describe("public read-only workspace", () => {
	test("navigates ranked actions without exposing mutations", async ({ page }) => {
		await page.goto("/demo/workspace");

		await expect(page.getByRole("heading", { name: "Ranked by cash impact and urgency" })).toBeVisible();
		await expect(page.getByRole("link", { name: /Collect Aurora Health/ })).toHaveAttribute(
			"href",
			"/demo/workspace/invoices",
		);
		await expect(page.getByRole("link", { name: /Decide on Client Delivery hardware/ })).toHaveAttribute(
			"href",
			"/demo/workspace/approvals",
		);
		await expect(page.getByRole("link", { name: /Cancel Notion trial seats/ })).toHaveAttribute(
			"href",
			"/demo/workspace/vendors",
		);

		await page.goto("/demo/workspace/approvals");
		await expect(page.getByText("Logitech")).toBeVisible();
		await expect(page.getByRole("button", { name: /Approve/ })).toHaveCount(0);
		await expect(page.getByRole("button", { name: /Reject/ })).toHaveCount(0);
	});
});

async function focusWithTab(page: Page, target: Locator) {
	for (let attempt = 0; attempt < 50; attempt += 1) {
		await page.keyboard.press("Tab");

		if (await target.evaluate((element) => element === document.activeElement)) {
			return;
		}
	}

	throw new Error("Keyboard focus did not reach the expected link.");
}
