import { createClient } from "@supabase/supabase-js";
import { getWorkspaceRuntimeConfig } from "@/services/env/app";

type CreateServerSupabaseClientParams = {
	accessToken?: string | null;
};

export const createServerSupabaseClient = ({ accessToken }: CreateServerSupabaseClientParams = {}) => {
	const config = getWorkspaceRuntimeConfig();

	if (!config.configured) {
		throw new Error(config.message);
	}

	return createClient(config.supabaseUrl, config.supabasePublishableKey, {
		auth: { persistSession: false },
		global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
	});
};
