import { ClerkProvider } from "@clerk/nextjs";
import {
	CLERK_SIGN_IN_REDIRECT_URL,
	CLERK_SIGN_IN_URL,
	CLERK_SIGN_UP_REDIRECT_URL,
	CLERK_SIGN_UP_URL,
	getClerkFrontendApiProxyUrl,
} from "./config";

type ServerAuthProviderProps = {
	children: React.ReactNode;
};

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
			proxyUrl={getClerkFrontendApiProxyUrl()}
			signInUrl={CLERK_SIGN_IN_URL}
			signUpUrl={CLERK_SIGN_UP_URL}
			signInFallbackRedirectUrl={CLERK_SIGN_IN_REDIRECT_URL}
			signUpFallbackRedirectUrl={CLERK_SIGN_UP_REDIRECT_URL}
		>
			{children}
		</ClerkProvider>
	);
};

const getClerkPublishableKey = () => process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
