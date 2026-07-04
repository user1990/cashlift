import { ClerkProvider } from "@clerk/nextjs";

type ServerAuthProviderProps = {
	children: React.ReactNode;
};

const SIGN_IN_URL = "/login";
const SIGN_UP_URL = "/signup";
const WORKSPACE_REDIRECT_URL = "/dashboard";

export const clerkPublishableKeyConfigured = () => Boolean(getClerkPublishableKey());

export const ServerAuthProvider = ({ children }: ServerAuthProviderProps) => {
	const publishableKey = getClerkPublishableKey();

	if (!publishableKey) {
		return children;
	}

	return (
		<ClerkProvider
			dynamic
			publishableKey={publishableKey}
			signInUrl={SIGN_IN_URL}
			signUpUrl={SIGN_UP_URL}
			signInFallbackRedirectUrl={WORKSPACE_REDIRECT_URL}
			signUpFallbackRedirectUrl={WORKSPACE_REDIRECT_URL}
		>
			{children}
		</ClerkProvider>
	);
};

const getClerkPublishableKey = () => process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
