import { createClient } from "@supabase/supabase-js";
import { getWorkspaceRuntimeConfig } from "@/services/env/app";
import { AppError } from "@/utilities/errors/AppError";

type CreateServerSupabaseClientParams = {
	accessToken?: string | null;
};

export const createServerSupabaseClient = ({ accessToken }: CreateServerSupabaseClientParams = {}) => {
	const config = getWorkspaceRuntimeConfig();

	if (!config.configured) {
		throw new AppError({
			code: "workspace_config_unavailable",
			details: { missingKeys: config.missingKeys, mode: config.mode },
			message: config.message,
		});
	}

	return createClient(config.supabaseUrl, config.supabasePublishableKey, {
		auth: { persistSession: false },
		global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
	});
};
