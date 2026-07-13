import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import { connection } from "next/server";
import { ServerAuthProvider } from "@/services/clerk/serverProvider";

export const metadata: Metadata = {
	title: "Sign up — CashLift",
	description: "Create a CashLift company workspace.",
};

export const instant = false;

export default async function SignUpPage() {
	await connection();

	return (
		<ServerAuthProvider>
			<SignUp fallbackRedirectUrl="/dashboard" signInUrl="/login" />
		</ServerAuthProvider>
	);
}
