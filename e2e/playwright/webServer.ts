const buildProductionServer = (port: string) => `pnpm exec next build && pnpm exec next start --port ${port}`;

const demoDevServer = (port: string) => `pnpm dev --port ${port}`;

const e2eSupabaseEnv = {
	NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
		process.env.E2E_NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "e2e-placeholder-anon-key",
	NEXT_PUBLIC_SUPABASE_URL: process.env.E2E_NEXT_PUBLIC_SUPABASE_URL ?? "https://invalid.local",
};

export const createDemoWebServerEnv = () => ({
	...process.env,
	...e2eSupabaseEnv,
	CASHLIFT_ALLOW_DEMO_PRODUCTION_BUILD: "1",
	CASHLIFT_APP_MODE: "demo",
	CASHLIFT_E2E: "1",
});

export const createProductionWebServerEnv = () => ({
	...process.env,
	...e2eSupabaseEnv,
	CASHLIFT_APP_MODE: "production",
	CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? "sk_test_example",
	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
		process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "pk_test_dGVzdC1jbGVyay5jbGVyay5hY2NvdW50cy5kZXYk",
});

export const resolveDemoWebServerCommand = (port: string) => {
	if (process.env.CI) {
		return demoDevServer(port);
	}

	return buildProductionServer(port);
};

export const resolveProductionWebServerCommand = (port: string) => demoDevServer(port);
