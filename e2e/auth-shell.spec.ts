import { expect, test } from "@playwright/test";

type BoundingBox = {
	height: number;
	width: number;
	x: number;
	y: number;
};

const AUTH_ROUTES = ["/login", "/signup"] as const;

const expectCentered = (mainBox: BoundingBox | null, surfaceBox: BoundingBox | null) => {
	if (!mainBox || !surfaceBox) {
		throw new Error("The authentication surface was not rendered.");
	}

	expect(Math.abs(mainBox.x + mainBox.width / 2 - (surfaceBox.x + surfaceBox.width / 2))).toBeLessThan(2);
	expect(Math.abs(mainBox.y + mainBox.height / 2 - (surfaceBox.y + surfaceBox.height / 2))).toBeLessThan(2);
};

test.describe("authentication shell", () => {
	for (const path of AUTH_ROUTES) {
		test(`keeps ${path} focused and centered`, async ({ page }) => {
			const consoleErrors: string[] = [];

			page.on("console", (message) => {
				if (message.type() === "error") {
					consoleErrors.push(message.text());
				}
			});

			await page.goto(path);

			await expect(page.getByRole("link", { name: "CashLift home" })).toBeVisible();
			await expect(page.locator("main")).not.toBeEmpty();
			await expect(page.getByRole("contentinfo")).toHaveCount(0);
			await expect(page.getByRole("navigation")).toHaveCount(0);

			const main = page.locator("main");
			const surface = page.getByRole("region", { name: "Authentication" });
			const [mainBox, surfaceBox] = await Promise.all([main.boundingBox(), surface.boundingBox()]);

			expectCentered(mainBox, surfaceBox);
			expect(consoleErrors).toEqual([]);
		});
	}

	test("keeps the authentication surface centered on a narrow viewport", async ({ page }) => {
		const consoleErrors: string[] = [];

		page.on("console", (message) => {
			if (message.type() === "error") {
				consoleErrors.push(message.text());
			}
		});

		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto("/login");

		const main = page.locator("main");
		const surface = page.getByRole("region", { name: "Authentication" });
		const [mainBox, surfaceBox] = await Promise.all([main.boundingBox(), surface.boundingBox()]);

		await expect(page.getByRole("link", { name: "CashLift home" })).toBeVisible();
		await expect(page.getByRole("contentinfo")).toHaveCount(0);
		await expect(page.getByRole("navigation")).toHaveCount(0);
		expectCentered(mainBox, surfaceBox);
		expect(consoleErrors).toEqual([]);
	});
});
