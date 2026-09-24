import { devices, type PlaywrightTestConfig } from "@playwright/test";

export const browserProjects: PlaywrightTestConfig["projects"] = [
	{ name: "chromium", use: { ...devices["Desktop Chrome"] } },
	{ name: "webkit", use: { ...devices["Desktop Safari"] } },
	{ name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
];
