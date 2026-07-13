import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { connection } from "next/server";
import { MainContent } from "@/modules/page-shell/components/MainContent";
import { ServerAuthProvider } from "@/services/clerk/serverProvider";

export const metadata: Metadata = {
	title: "Login — CashLift",
	description: "Log in to a CashLift company workspace.",
};

export const instant = false;

export default async function Login() {
	await connection();

	return (
		<MainContent variant="workspace" className="flex justify-center px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
			<ServerAuthProvider>
				<SignIn fallbackRedirectUrl="/dashboard" signUpUrl="/signup" />
			</ServerAuthProvider>
		</MainContent>
	);
}
