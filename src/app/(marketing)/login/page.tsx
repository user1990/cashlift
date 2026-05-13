import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { AuthPage } from "@/modules/features/marketing/components/AuthPage";

export const metadata: Metadata = {
	title: "Login — CashLift",
	description: "Log in to a CashLift company workspace.",
};

export default function Login() {
	if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
		return <AuthPage mode="login" />;
	}

	return (
		<main className="mx-auto flex max-w-[980px] justify-center px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
			<SignIn />
		</main>
	);
}
