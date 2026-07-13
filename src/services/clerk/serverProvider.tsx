import { ClerkProvider } from "@clerk/nextjs";
import {
	CLERK_SIGN_IN_URL,
	CLERK_SIGN_UP_URL,
	CLERK_WORKSPACE_REDIRECT_URL,
	getRequiredClerkPublishableKey,
} from "./config";

type ServerAuthProviderProps = {
	children: React.ReactNode;
};

export const ServerAuthProvider = ({ children }: ServerAuthProviderProps) => {
	const publishableKey = getRequiredClerkPublishableKey();

	return (
		<ClerkProvider
			dynamic
			publishableKey={publishableKey}
			signInUrl={CLERK_SIGN_IN_URL}
			signUpUrl={CLERK_SIGN_UP_URL}
			signInFallbackRedirectUrl={CLERK_WORKSPACE_REDIRECT_URL}
			signUpFallbackRedirectUrl={CLERK_WORKSPACE_REDIRECT_URL}
		>
			{children}
		</ClerkProvider>
	);
};
