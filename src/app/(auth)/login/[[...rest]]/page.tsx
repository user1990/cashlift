import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { connection } from "next/server";
import { ServerAuthProvider } from "@/services/clerk/serverProvider";
import { AuthGlassLoading } from "../../_components/AuthGlassLoading";
import { AuthGlassShell } from "../../_components/AuthGlassShell";
import { ClerkSignInPasswordAutocomplete } from "../../_components/ClerkSignInPasswordAutocomplete";
import { AUTH_APPEARANCE } from "../../_lib/authAppearance";

export const metadata: Metadata = {
	title: "Login — CashLift",
	description: "Log in to a CashLift company workspace.",
};

export const instant = false;

export default async function Login() {
	await connection();

	return (
		<AuthGlassShell action={{ href: "/signup", label: "Create account", prompt: "New to CashLift?" }}>
			<ServerAuthProvider>
				<ClerkSignInPasswordAutocomplete />

				<ClerkLoading>
					<AuthGlassLoading />
				</ClerkLoading>

				<ClerkLoaded>
					<SignIn appearance={AUTH_APPEARANCE} fallbackRedirectUrl="/dashboard" signUpUrl="/signup" />
				</ClerkLoaded>
			</ServerAuthProvider>
		</AuthGlassShell>
	);
}
