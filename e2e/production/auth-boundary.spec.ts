import { expect, test } from "@playwright/test";

test("keeps the static tour public and production workspace routes protected", async ({ page, request }) => {
	await page.goto("/demo/workspace");
	await expect(page.getByText("Read-only demo").first()).toBeVisible();

	const dashboardResponse = await request.get("/dashboard", { maxRedirects: 0 });

	expect(dashboardResponse.status()).toBe(307);
	expect(dashboardResponse.headers().location).toContain("/login");

	const apiResponse = await request.get("/api/workspace/dataset", {
		headers: { Accept: "application/json" },
		maxRedirects: 0,
	});

	expect(apiResponse.ok()).toBe(false);
	expect([307, 401, 404]).toContain(apiResponse.status());

	if (apiResponse.status() === 307) {
		expect(apiResponse.headers().location).toContain("/login");
	}
});
