import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import { MainContent } from "@/modules/page-shell/components/MainContent";
import { AuthProvider } from "@/services/clerk/provider";

export const metadata: Metadata = {
	title: "Sign up — CashLift",
	description: "Create a CashLift company workspace.",
};

export default function SignUpPage() {
	return (
		<MainContent variant="workspace" className="flex justify-center px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
			<AuthProvider>
				<SignUp fallbackRedirectUrl="/dashboard" signInUrl="/login" />
			</AuthProvider>
		</MainContent>
	);
}
