import type { Page } from "@playwright/test";
import { BRAND_FORGE_SPEND_REQUEST_FIXTURE } from "../../src/test/fixtures/spendRequests";

const SPEND_REQUEST_PATCH = /\/api\/v1\/workspace\/spend-requests\/[^/]+$/;

export const delaySpendRequestPatch = async (page: Page, delayMs = 2_000) => {
	await page.route(SPEND_REQUEST_PATCH, async (route) => {
		if (route.request().method() !== "PATCH") {
			await route.continue();

			return;
		}

		const body = route.request().postDataJSON() as { status?: string };
		const id = decodeURIComponent(route.request().url().split("/").pop() ?? "");

		await new Promise((resolve) => {
			setTimeout(resolve, delayMs);
		});

		await route.fulfill({
			contentType: "application/json",
			body: JSON.stringify({
				...BRAND_FORGE_SPEND_REQUEST_FIXTURE,
				id,
				status: body.status ?? "approved",
			}),
		});
	});
};
