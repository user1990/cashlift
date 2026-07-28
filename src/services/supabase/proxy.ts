import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const updateSupabaseSession = async (request: NextRequest, requestHeaders = request.headers) => {
	let response = NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});

	if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
		return response;
	}

	const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
		cookies: {
			getAll() {
				return request.cookies.getAll();
			},
			setAll(cookiesToSet) {
				for (const { name, value } of cookiesToSet) {
					request.cookies.set(name, value);
				}

				response = NextResponse.next({
					request: {
						headers: requestHeaders,
					},
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
