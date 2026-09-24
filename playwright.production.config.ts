import { defineConfig, devices } from "@playwright/test";
import { createProductionWebServerEnv, resolveProductionWebServerCommand } from "./e2e/playwright/webServer";

if (process.env.FORCE_COLOR) {
	delete process.env.NO_COLOR;
}

const productionPort = process.env.E2E_PRODUCTION_PORT ?? "3100";
const productionBaseUrl = `http://127.0.0.1:${productionPort}`;

export default defineConfig({
	expect: { timeout: 10_000 },
	forbidOnly: !!process.env.CI,
	projects: [{ name: "production-auth-boundary", use: { ...devices["Desktop Chrome"] } }],
	reporter: process.env.CI ? "github" : "list",
	retries: process.env.CI ? 1 : 0,
	testDir: "./e2e/production",
	timeout: 60_000,
	use: {
		baseURL: productionBaseUrl,
		trace: "retain-on-failure",
	},
	webServer: {
		command: resolveProductionWebServerCommand(productionPort),
		env: createProductionWebServerEnv(),
		reuseExistingServer: false,
		timeout: process.env.CI ? 120_000 : 300_000,
		url: productionBaseUrl,
	},
	workers: 1,
});
