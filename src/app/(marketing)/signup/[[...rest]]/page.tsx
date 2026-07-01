import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCardFallback } from "@/modules/marketing/components/AuthCardFallback";
import { MainContent } from "@/modules/page-shell/components/MainContent";
import { AuthProvider } from "@/services/clerk/provider";

export const metadata: Metadata = {
	title: "Sign up — CashLift",
	description: "Create a CashLift company workspace.",
};

export const instant = false;

export default function SignUpPage() {
	return (
		<MainContent variant="workspace" className="flex justify-center px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
			<Suspense fallback={<AuthCardFallback title="Loading sign up" />}>
				<AuthProvider>
					<SignUp fallbackRedirectUrl="/dashboard" signInUrl="/login" />
				</AuthProvider>
			</Suspense>
		</MainContent>
	);
}
