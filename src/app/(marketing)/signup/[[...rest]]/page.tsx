import { ClerkFailed, ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import { connection } from "next/server";
import { AuthStatusCard } from "@/modules/marketing/components/AuthStatusCard";
import { MainContent } from "@/modules/page-shell/components/MainContent";
import { clerkPublishableKeyConfigured, ServerAuthProvider } from "@/services/clerk/serverProvider";

export const metadata: Metadata = {
	title: "Sign up — CashLift",
	description: "Create a CashLift company workspace.",
};

export const instant = false;

export default async function SignUpPage() {
	await connection();

	return (
		<MainContent variant="workspace" className="flex justify-center px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
			{clerkPublishableKeyConfigured() ? (
				<ServerAuthProvider>
					<ClerkLoading>
						<AuthStatusCard description="Loading…" />
					</ClerkLoading>

					<ClerkLoaded>
						<SignUp fallbackRedirectUrl="/onboarding" signInUrl="/login" />
					</ClerkLoaded>

					<ClerkFailed>
						<AuthStatusCard
							variant="error"
							description="We could not load secure signup. Try again or contact support."
							retryHref="/signup"
						/>
					</ClerkFailed>
				</ServerAuthProvider>
			) : (
				<AuthStatusCard variant="error" description="Authentication is not configured for this environment yet." />
			)}
		</MainContent>
	);
}
