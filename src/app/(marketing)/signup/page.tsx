import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import { AuthPage } from "@/modules/features/marketing/components/AuthPage";

export const metadata: Metadata = {
	title: "Sign up — CashLift",
	description: "Create a CashLift company workspace.",
};

export default function SignUpPage() {
	if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
		return <AuthPage mode="signup" />;
	}

	return (
		<main className="mx-auto flex max-w-[980px] justify-center px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
			<SignUp />
		</main>
	);
}
