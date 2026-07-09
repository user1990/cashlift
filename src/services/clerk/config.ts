export const CLERK_SIGN_IN_URL = "/login";
export const CLERK_SIGN_UP_URL = "/signup";
export const CLERK_WORKSPACE_REDIRECT_URL = "/dashboard";
export const CLERK_FRONTEND_API_PROXY_URL = "/__clerk";

export const clerkFrontendApiProxyEnabled = (nodeEnv = process.env.NODE_ENV) => nodeEnv === "production";

export const getClerkFrontendApiProxyUrl = () =>
	clerkFrontendApiProxyEnabled() ? CLERK_FRONTEND_API_PROXY_URL : undefined;

export const getRequiredClerkPublishableKey = (value?: string) =>
	getRequiredClerkValue("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", value ?? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

const getRequiredClerkValue = (name: string, value: string | undefined) => {
	const normalized = value?.trim();

	if (!normalized) {
		throw new Error(`${name} must be configured for Clerk authentication.`);
	}

	return normalized;
};
