import { devices, type PlaywrightTestConfig } from "@playwright/test";

const crossBrowserJourneys = /(a11y-smoke|demo-approval-workflow|keyboard-approvals)\.spec\.ts/;

export const browserProjects: PlaywrightTestConfig["projects"] = [
	{ name: "chromium", use: { ...devices["Desktop Chrome"] } },
	{
		name: "webkit",
		testMatch: crossBrowserJourneys,
		use: { ...devices["Desktop Safari"] },
	},
	{
		name: "mobile-chrome",
		testMatch: crossBrowserJourneys,
		use: { ...devices["Pixel 7"] },
	},
];
