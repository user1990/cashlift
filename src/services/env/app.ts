export type CashLiftAppMode = "demo" | "production";

/** Allows tests to pass partial env objects without satisfying full `ProcessEnv`. */
export type CashLiftProcessEnv = Record<string, string | undefined>;

export type WorkspaceRuntimeConfig =
	| {
			configured: true;
			mode: CashLiftAppMode;
			supabasePublishableKey: string;
			supabaseUrl: string;
	  }
	| {
			configured: false;
			message: string;
			mode: CashLiftAppMode;
			missingKeys: string[];
	  };

const PRODUCTION_ENV_KEYS = [
	"NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
	"CLERK_SECRET_KEY",
	"NEXT_PUBLIC_SUPABASE_URL",
	"NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
] as const;

export const getCashLiftAppMode = (env: CashLiftProcessEnv = process.env): CashLiftAppMode => {
	if (env.NODE_ENV === "production" && env.CASHLIFT_APP_MODE === "demo") {
		throw new Error("CASHLIFT_APP_MODE must be production in production deployments.");
	}

	if (env.CASHLIFT_APP_MODE === "demo" || env.CASHLIFT_APP_MODE === "production") {
		return env.CASHLIFT_APP_MODE;
	}

	return env.CI || env.NODE_ENV === "production" ? "production" : "demo";
};

export const workspaceDemoEnabled = (env: CashLiftProcessEnv = process.env) => getCashLiftAppMode(env) === "demo";

export const getWorkspaceRuntimeConfig = (env: CashLiftProcessEnv = process.env): WorkspaceRuntimeConfig => {
	const mode = getCashLiftAppMode(env);
	const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
	const supabasePublishableKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

	if (mode === "demo") {
		return {
			configured: true,
			mode,
			supabasePublishableKey: supabasePublishableKey ?? "",
			supabaseUrl: supabaseUrl ?? "",
		};
	}

	const missingKeys = getMissingKeys(env, PRODUCTION_ENV_KEYS);

	if (missingKeys.length > 0) {
		return {
			configured: false,
			message: "Workspace production environment variables are not configured.",
			missingKeys,
			mode,
		};
	}

	return {
		configured: true,
		mode,
		supabasePublishableKey: supabasePublishableKey ?? "",
		supabaseUrl: supabaseUrl ?? "",
	};
};

const getMissingKeys = (env: CashLiftProcessEnv, keys: readonly string[]) => keys.filter((key) => !env[key]?.trim());
