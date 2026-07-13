const CLERK_FRONTEND_API_PROXY_URL = "/__clerk";
export const CLERK_SIGN_IN_REDIRECT_URL = "/dashboard";
export const CLERK_SIGN_IN_URL = "/login";
export const CLERK_SIGN_UP_REDIRECT_URL = "/onboarding";
export const CLERK_SIGN_UP_URL = "/signup";

export const clerkFrontendApiProxyEnabled = (nodeEnv = process.env.NODE_ENV) => nodeEnv === "production";

export const getClerkFrontendApiProxyUrl = (nodeEnv = process.env.NODE_ENV) =>
	clerkFrontendApiProxyEnabled(nodeEnv) ? CLERK_FRONTEND_API_PROXY_URL : undefined;
