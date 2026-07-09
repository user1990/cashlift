export const CLERK_SIGN_IN_URL = "/login";
export const CLERK_SIGN_UP_URL = "/signup";
export const CLERK_WORKSPACE_REDIRECT_URL = "/dashboard";
export const CLERK_FRONTEND_API_PROXY_URL = "/__clerk";

export const getRequiredClerkPublishableKey = (value = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) =>
	getRequiredClerkValue("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", value);

const getRequiredClerkValue = (name: string, value: string | undefined) => {
	const normalized = value?.trim();

	if (!normalized) {
		throw new Error(`${name} must be configured for Clerk authentication.`);
	}

	return normalized;
};

export const getRequiredClerkValueForConfig = getRequiredClerkValue;
