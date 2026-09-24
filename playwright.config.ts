import { defineConfig } from "@playwright/test";
import { browserProjects } from "./e2e/playwright/projects";
import { createDemoWebServerEnv, resolveDemoWebServerCommand } from "./e2e/playwright/webServer";

if (process.env.FORCE_COLOR) {
	delete process.env.NO_COLOR;
}

const localPort = process.env.E2E_PORT ?? "3000";
const localBaseUrl = `http://127.0.0.1:${localPort}`;

export default defineConfig({
	expect: { timeout: 10_000 },
	forbidOnly: !!process.env.CI,
	fullyParallel: true,
	projects: browserProjects,
	reporter: process.env.CI ? "github" : "list",
	retries: process.env.CI ? 1 : 0,
	testDir: "./e2e",
	testIgnore: "production/**",
	timeout: 60_000,
	use: {
		baseURL: process.env.E2E_BASE_URL ?? localBaseUrl,
		trace: "retain-on-failure",
	},
	webServer: {
		command: resolveDemoWebServerCommand(localPort),
		env: createDemoWebServerEnv(),
		reuseExistingServer: false,
		timeout: process.env.CI ? 120_000 : 300_000,
		url: localBaseUrl,
	},
	workers: process.env.CI ? 1 : undefined,
});
