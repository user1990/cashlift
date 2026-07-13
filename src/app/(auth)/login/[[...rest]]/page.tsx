import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { connection } from "next/server";
import { AuthUnavailableCard } from "@/modules/marketing/components/AuthUnavailableCard";
import { clerkPublishableKeyConfigured, ServerAuthProvider } from "@/services/clerk/serverProvider";

export const metadata: Metadata = {
	title: "Login — CashLift",
	description: "Log in to a CashLift company workspace.",
};

export const instant = false;

export default async function Login() {
	await connection();

	return clerkPublishableKeyConfigured() ? (
		<ServerAuthProvider>
			<SignIn fallbackRedirectUrl="/dashboard" signUpUrl="/signup" />
		</ServerAuthProvider>
	) : (
		<AuthUnavailableCard />
	);
}
