import { ClerkFailed, ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { connection } from "next/server";
import { AuthStatusCard } from "@/modules/marketing/components/AuthStatusCard";
import { MainContent } from "@/modules/page-shell/components/MainContent";
import { clerkPublishableKeyConfigured, ServerAuthProvider } from "@/services/clerk/serverProvider";

export const metadata: Metadata = {
	title: "Login — CashLift",
	description: "Log in to a CashLift company workspace.",
};

export const instant = false;

export default async function Login() {
	await connection();

	return (
		<MainContent variant="workspace" className="flex justify-center px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
			{clerkPublishableKeyConfigured() ? (
				<ServerAuthProvider>
					<ClerkLoading>
						<AuthStatusCard description="Loading…" />
					</ClerkLoading>

					<ClerkLoaded>
						<SignIn fallbackRedirectUrl="/dashboard" signUpUrl="/signup" />
					</ClerkLoaded>

					<ClerkFailed>
						<AuthStatusCard
							variant="error"
							description="We could not load secure sign-in. Try again or contact support."
							retryHref="/login"
						/>
					</ClerkFailed>
				</ServerAuthProvider>
			) : (
				<AuthStatusCard variant="error" description="Authentication is not configured for this environment yet." />
			)}
		</MainContent>
	);
}
