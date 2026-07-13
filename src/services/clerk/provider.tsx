"use client";

import { ClerkProvider } from "@clerk/nextjs";
import {
	CLERK_SIGN_IN_REDIRECT_URL,
	CLERK_SIGN_IN_URL,
	CLERK_SIGN_UP_REDIRECT_URL,
	CLERK_SIGN_UP_URL,
	getClerkFrontendApiProxyUrl,
} from "./config";

type AuthProviderProps = {
	children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

	if (!publishableKey) {
		return children;
	}

	return (
		<ClerkProvider
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
