import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import { connection } from "next/server";
import { ServerAuthProvider } from "@/services/clerk/serverProvider";
import { AuthGlassLoading } from "../../_components/AuthGlassLoading";
import { AuthGlassShell } from "../../_components/AuthGlassShell";
import { AUTH_APPEARANCE } from "../../_lib/authAppearance";

export const metadata: Metadata = {
	title: "Sign up — CashLift",
	description: "Create a CashLift company workspace.",
};

export const instant = false;

export default async function SignUpPage() {
	await connection();

	return (
		<AuthGlassShell action={{ href: "/login", label: "Sign in", prompt: "Already have an account?" }} size="expanded">
			<ServerAuthProvider>
				<ClerkLoading>
					<AuthGlassLoading />
				</ClerkLoading>

				<ClerkLoaded>
					<SignUp appearance={AUTH_APPEARANCE} fallbackRedirectUrl="/dashboard" signInUrl="/login" />
				</ClerkLoaded>
			</ServerAuthProvider>
		</AuthGlassShell>
	);
}
