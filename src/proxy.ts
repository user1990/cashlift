import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { updateSupabaseSession } from "@/services/supabase/proxy";

const CLERK_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
const handleSupabaseSession = (request: NextRequest) => updateSupabaseSession(request);

export default CLERK_CONFIGURED
	? clerkMiddleware(async (_auth, request) => updateSupabaseSession(request))
	: handleSupabaseSession;

export const config = {
	matcher: ["/((?!_next|.*\\..*).*)", "/api/(.*)"],
};
