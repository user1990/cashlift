import type { Page } from "@playwright/test";

const SPEND_REQUEST_PATCH = "**/api/v1/workspace/spend-requests/*";

export const delaySpendRequestPatch = async (page: Page, delayMs = 1_500) => {
	await page.route(SPEND_REQUEST_PATCH, async (route) => {
		if (route.request().method() !== "PATCH") {
			await route.continue();

			return;
		}

		await new Promise((resolve) => {
			setTimeout(resolve, delayMs);
		});
		await route.continue();
	});
};
