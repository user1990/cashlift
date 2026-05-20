"use client";

import { ClerkProvider } from "@clerk/nextjs";

type AuthProviderProps = {
	children: React.ReactNode;
};

const SIGN_IN_URL = "/login";
const SIGN_UP_URL = "/signup";
const WORKSPACE_REDIRECT_URL = "/dashboard";

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

	if (!publishableKey) {
		return children;
	}

	return (
		<ClerkProvider
			publishableKey={publishableKey}
			signInFallbackRedirectUrl={WORKSPACE_REDIRECT_URL}
			signInUrl={SIGN_IN_URL}
			signUpFallbackRedirectUrl={WORKSPACE_REDIRECT_URL}
			signUpUrl={SIGN_UP_URL}
		>
			{children}
		</ClerkProvider>
	);
};
