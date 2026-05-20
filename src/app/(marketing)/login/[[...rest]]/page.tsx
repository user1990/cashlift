import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { MainContent } from "@/modules/page-shell/components/MainContent";
import { AuthProvider } from "@/services/clerk/provider";

export const metadata: Metadata = {
	title: "Login — CashLift",
	description: "Log in to a CashLift company workspace.",
};

export default function Login() {
	return (
		<MainContent variant="workspace" className="flex justify-center px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
			<AuthProvider>
				<SignIn fallbackRedirectUrl="/dashboard" signUpUrl="/signup" />
			</AuthProvider>
		</MainContent>
	);
}
