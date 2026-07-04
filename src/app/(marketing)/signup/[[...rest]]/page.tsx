import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import { connection } from "next/server";
import { AuthUnavailableCard } from "@/modules/marketing/components/AuthUnavailableCard";
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
					<SignUp fallbackRedirectUrl="/dashboard" signInUrl="/login" />
				</ServerAuthProvider>
			) : (
				<AuthUnavailableCard />
			)}
		</MainContent>
	);
}
