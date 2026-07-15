import { expect, type Locator, type Page, test } from "@playwright/test";

test.describe("homepage decision story", () => {
	test("opens the public demo and booking form from truthful calls to action", async ({ page }) => {
		await page.goto("/");

		await expect(page.getByRole("heading", { level: 1 })).toHaveText("See what to collect, approve, or cut today.");
		await expect(page.getByRole("heading", { name: "Meet Studio Nova" })).toBeVisible();
		await expect(
			page.getByText(
				"Studio Nova is a fictional services company used to demonstrate CashLift with realistic, illustrative data.",
			),
		).toBeVisible();

		await page.locator("main").getByRole("link", { name: "Open live demo" }).click();
		await expect(page).toHaveURL(/\/demo\/workspace$/);
		await expect(page.getByText("Read-only demo").first()).toBeVisible();

		await page.goto("/");
		await page.getByRole("link", { name: "Book an audit walkthrough" }).click();
		await expect(page).toHaveURL(/\/demo$/);
		await expect(page.getByText("Book an audit walkthrough.", { exact: true })).toBeVisible();
	});

	test("pairs every decision with its product view through normal scrolling", async ({ page }) => {
		await page.setViewportSize({ height: 900, width: 1280 });
		await page.goto("/");

		for (const { alt, chapter, title } of [
			{
				alt: "Studio Nova approval queue showing the cash remaining after a hardware request",
				chapter: "approve",
				title: "Know the cash impact before saying yes.",
			},
			{
				alt: "Studio Nova invoice view highlighting overdue collection risk",
				chapter: "recover",
				title: "Chase the invoice that protects the buffer.",
			},
			{
				alt: "Studio Nova vendor view showing low-use and duplicate subscriptions",
				chapter: "cut",
				title: "Stop low-use renewals before they hit cash.",
			},
		]) {
			const decision = page.locator(`[data-story-chapter="${chapter}"]`);

			await decision.scrollIntoViewIfNeeded();
			await expect(decision.getByRole("heading", { name: title })).toBeVisible();
			await expect(decision.getByRole("img", { name: alt })).toBeVisible();
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

	test("keeps every chapter readable when JavaScript is disabled", async ({ browser, baseURL }) => {
		const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
		const page = await context.newPage();

		await page.goto("/");
		await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
		await expect(page.locator("[data-story-chapter]")).toHaveCount(3);
		await expect(page.locator("[data-story-chapter] img")).toHaveCount(3);

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
