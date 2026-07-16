import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { connection } from "next/server";
import { ServerAuthProvider } from "@/services/clerk/serverProvider";
import { AuthFormLoading } from "../../_components/AuthFormLoading";

export const metadata: Metadata = {
	title: "Login — CashLift",
	description: "Log in to a CashLift company workspace.",
};

export const instant = false;

export default async function Login() {
	await connection();

	return (
		<ServerAuthProvider>
			<ClerkLoading>
				<AuthFormLoading title="Sign in to CashLift" />
			</ClerkLoading>

			<ClerkLoaded>
				<SignIn fallbackRedirectUrl="/dashboard" signUpUrl="/signup" />
			</ClerkLoaded>
		</ServerAuthProvider>
	);
}
