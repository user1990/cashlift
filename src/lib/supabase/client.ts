import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient() {
	if (supabaseClient) {
		return supabaseClient;
	}

	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!url || !anonKey) {
		throw new Error("Supabase environment variables are not configured.");
	}

	supabaseClient = createClient(url, anonKey);
	return supabaseClient;
}
