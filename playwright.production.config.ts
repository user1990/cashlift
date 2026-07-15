import { defineConfig, devices } from "@playwright/test";

if (process.env.FORCE_COLOR) {
	delete process.env.NO_COLOR;
}

const productionBaseUrl = "http://127.0.0.1:3100";

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
		trace: "on-first-retry",
	},
	webServer: {
		command: "pnpm dev --port 3100",
		env: {
			...process.env,
			CASHLIFT_APP_MODE: "production",
			CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? "sk_test_example",
			NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
				process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "pk_test_dGVzdC1jbGVyay5jbGVyay5hY2NvdW50cy5kZXYk",
			NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
				process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "e2e-placeholder-anon-key",
			NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://invalid.local",
		},
		reuseExistingServer: false,
		timeout: 180_000,
		url: productionBaseUrl,
	},
	workers: 1,
});
