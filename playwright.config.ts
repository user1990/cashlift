import { defineConfig, devices } from "@playwright/test";

if (process.env.FORCE_COLOR) {
	delete process.env.NO_COLOR;
}

const localBaseUrl = "http://127.0.0.1:3000";

export default defineConfig({
	expect: { timeout: 10_000 },
	forbidOnly: !!process.env.CI,
	fullyParallel: true,
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
	reporter: process.env.CI ? "github" : "list",
	retries: process.env.CI ? 1 : 0,
	testDir: "./e2e",
	timeout: 60_000,
	use: {
		baseURL: process.env.E2E_BASE_URL ?? localBaseUrl,
		trace: "on-first-retry",
	},
	webServer: {
		command: "pnpm dev",
		env: {
			...process.env,
			CASHLIFT_APP_MODE: "demo",
			CLERK_SECRET_KEY: process.env.E2E_CLERK_SECRET_KEY ?? "e2e-placeholder-secret-key",
			NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
				process.env.E2E_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "pk_test_Y2xlcmsuZXhhbXBsZSQ",
			NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
				process.env.E2E_NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "e2e-placeholder-anon-key",
			NEXT_PUBLIC_SUPABASE_URL: process.env.E2E_NEXT_PUBLIC_SUPABASE_URL ?? "https://invalid.local",
		},
		reuseExistingServer: !process.env.CI,
		timeout: 180_000,
		url: localBaseUrl,
	},
	workers: process.env.CI ? 1 : undefined,
});
