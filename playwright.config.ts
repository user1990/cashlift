import { defineConfig, devices } from "@playwright/test";

if (process.env.FORCE_COLOR) {
	delete process.env.NO_COLOR;
}

const localPort = process.env.E2E_PORT ?? "3000";
const localBaseUrl = `http://127.0.0.1:${localPort}`;

export default defineConfig({
	expect: { timeout: 10_000 },
	forbidOnly: !!process.env.CI,
	fullyParallel: true,
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
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
		command: `pnpm dev --port ${localPort}`,
		env: {
			...process.env,
			CASHLIFT_APP_MODE: "demo",
			NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
				process.env.E2E_NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "e2e-placeholder-anon-key",
			NEXT_PUBLIC_SUPABASE_URL: process.env.E2E_NEXT_PUBLIC_SUPABASE_URL ?? "https://invalid.local",
		},
		reuseExistingServer: false,
		timeout: 180_000,
		url: localBaseUrl,
	},
	workers: process.env.CI ? 1 : undefined,
});
