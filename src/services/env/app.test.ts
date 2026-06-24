import { describe, expect, it } from "vitest";
import { getKuvroAppMode, getWorkspaceRuntimeConfig, workspaceDemoEnabled } from "./app";

describe("Kuvro app environment", () => {
	it("defaults local development to demo mode", () => {
		expect(getKuvroAppMode({ NODE_ENV: "development" })).toEqual("demo");
		expect(workspaceDemoEnabled({ NODE_ENV: "development" })).toEqual(true);
	});

	it("defaults CI and production to production mode", () => {
		expect(getKuvroAppMode({ CI: "true" })).toEqual("production");
		expect(getKuvroAppMode({ NODE_ENV: "production" })).toEqual("production");
	});

	it("rejects demo mode in production", () => {
		expect(() => getKuvroAppMode({ KUVRO_APP_MODE: "demo", NODE_ENV: "production" })).toThrow(
			"KUVRO_APP_MODE must be production in production deployments.",
		);
	});

	it("requires production auth and Supabase keys", () => {
		const config = getWorkspaceRuntimeConfig({ KUVRO_APP_MODE: "production" });

		expect(config).toMatchObject({
			configured: false,
			missingKeys: [
				"NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
				"CLERK_SECRET_KEY",
				"NEXT_PUBLIC_SUPABASE_URL",
				"NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
			],
		});
	});

	it("accepts configured production workspace environment", () => {
		const config = getWorkspaceRuntimeConfig({
			KUVRO_APP_MODE: "production",
			CLERK_SECRET_KEY: "clerk-secret",
			NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "clerk-public",
			NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "supabase-public",
			NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
		});

		expect(config).toMatchObject({
			configured: true,
			mode: "production",
			supabasePublishableKey: "supabase-public",
			supabaseUrl: "https://example.supabase.co",
		});
	});
});
