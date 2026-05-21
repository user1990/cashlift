import { vi } from "vitest";

export const stubDemoWorkspaceEnv = () => {
	vi.stubEnv("CASHLIFT_APP_MODE", "demo");
};

export const stubProductionWorkspaceEnv = () => {
	vi.stubEnv("CASHLIFT_APP_MODE", "production");
	vi.stubEnv("CLERK_SECRET_KEY", "secret");
	vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk");
	vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
	vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "anon");
};
