import { getRequiredClerkValue } from "./requiredValue";

export const CLERK_SIGN_IN_URL = "/login";
export const CLERK_SIGN_UP_URL = "/signup";
export const CLERK_WORKSPACE_REDIRECT_URL = "/dashboard";

export const getRequiredClerkPublishableKey = (value?: string) =>
	getRequiredClerkValue("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", value ?? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
