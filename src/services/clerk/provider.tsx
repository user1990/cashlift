"use client";

import { ClerkProvider } from "@clerk/nextjs";

type AppAuthProviderProps = {
	children: React.ReactNode;
};

export function AppAuthProvider({ children }: AppAuthProviderProps) {
	const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

	if (!publishableKey) {
		return children;
	}

	return (
		<ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>
	);
}
