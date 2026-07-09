"use client";

import { ClerkProvider } from "@clerk/nextjs";
import {
	CLERK_FRONTEND_API_PROXY_URL,
	CLERK_SIGN_IN_URL,
	CLERK_SIGN_UP_URL,
	CLERK_WORKSPACE_REDIRECT_URL,
	getRequiredClerkPublishableKey,
} from "./config";

type AuthProviderProps = {
	children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const publishableKey = getRequiredClerkPublishableKey();

	return (
		<ClerkProvider
			publishableKey={publishableKey}
			proxyUrl={CLERK_FRONTEND_API_PROXY_URL}
			signInUrl={CLERK_SIGN_IN_URL}
			signUpUrl={CLERK_SIGN_UP_URL}
			signInFallbackRedirectUrl={CLERK_WORKSPACE_REDIRECT_URL}
			signUpFallbackRedirectUrl={CLERK_WORKSPACE_REDIRECT_URL}
		>
			{children}
		</ClerkProvider>
	);
};
