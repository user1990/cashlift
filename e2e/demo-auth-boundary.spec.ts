import { expect, test } from "@playwright/test";

test.describe("demo auth boundary", () => {
	test("does not load Clerk assets in the demo workspace", async ({ page }) => {
		const clerkRequests: string[] = [];

		page.on("request", (request) => {
			const url = request.url();

			if (url.includes("/__clerk") || url.includes("clerk.browser.js") || url.includes("clerk.accounts.dev")) {
				clerkRequests.push(url);
			}
		});

		await page.goto("/dashboard");

		await expect(page.getByRole("navigation", { name: "Workspace" })).toBeVisible();
		expect(clerkRequests).toEqual([]);
	});
});
