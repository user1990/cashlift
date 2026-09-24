import { devices, type PlaywrightTestConfig } from "@playwright/test";

export const browserProjects: PlaywrightTestConfig["projects"] = [
	{ name: "chromium", use: { ...devices["Desktop Chrome"] } },
	{
		name: "webkit",
		testMatch: /a11y-smoke\.spec\.ts/,
		use: { ...devices["Desktop Safari"] },
	},
	{
		name: "mobile-chrome",
		testMatch: /a11y-smoke\.spec\.ts/,
		use: { ...devices["Pixel 7"] },
	},
];
