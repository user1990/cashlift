import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const updateSupabaseSession = async (request: NextRequest) => {
	let response = NextResponse.next({
		request,
	});

	if (!supabaseUrl || !supabasePublishableKey) {
		return response;
	}

	const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
		cookies: {
			getAll() {
				return request.cookies.getAll();
			},
			setAll(cookiesToSet) {
				for (const { name, value } of cookiesToSet) {
					request.cookies.set(name, value);
				}

				response = NextResponse.next({
					request,
				});

				for (const { name, value, options } of cookiesToSet) {
					response.cookies.set(name, value, options);
				}
			},
		},
	});

	await supabase.auth.getClaims();

	return response;
};
