export type KuvroAppMode = "demo" | "production";

/** Allows tests to pass partial env objects without satisfying full `ProcessEnv`. */
export type KuvroProcessEnv = Record<string, string | undefined>;

export type WorkspaceRuntimeConfig =
	| {
			configured: true;
			mode: KuvroAppMode;
			supabasePublishableKey: string;
			supabaseUrl: string;
	  }
	| {
			configured: false;
			message: string;
			mode: KuvroAppMode;
			missingKeys: string[];
	  };

const PRODUCTION_ENV_KEYS = [
	"NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
	"CLERK_SECRET_KEY",
	"NEXT_PUBLIC_SUPABASE_URL",
	"NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
] as const;

export const getKuvroAppMode = (env: KuvroProcessEnv = process.env): KuvroAppMode => {
	if (env.NODE_ENV === "production" && env.KUVRO_APP_MODE === "demo") {
		throw new Error("KUVRO_APP_MODE must be production in production deployments.");
	}

	if (env.KUVRO_APP_MODE === "demo" || env.KUVRO_APP_MODE === "production") {
		return env.KUVRO_APP_MODE;
	}

	return env.CI || env.NODE_ENV === "production" ? "production" : "demo";
};

export const workspaceDemoEnabled = (env: KuvroProcessEnv = process.env) => getKuvroAppMode(env) === "demo";

export const getWorkspaceRuntimeConfig = (env: KuvroProcessEnv = process.env): WorkspaceRuntimeConfig => {
	const mode = getKuvroAppMode(env);
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

const getMissingKeys = (env: KuvroProcessEnv, keys: readonly string[]) => keys.filter((key) => !env[key]?.trim());
