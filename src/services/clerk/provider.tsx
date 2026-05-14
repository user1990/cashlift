"use client";

import { ClerkProvider } from "@clerk/nextjs";

type AuthProviderProps = {
	children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
	const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

	if (!publishableKey) {
		return children;
	}

	return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
}
