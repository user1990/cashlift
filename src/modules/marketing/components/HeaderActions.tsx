import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { workspaceDemoEnabled } from "@/services/env/app";
import { MobileNav } from "./MobileNav";

export const HeaderActions = async () => {
	const clerkEnabled = !workspaceDemoEnabled() && !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
	const signedIn = clerkEnabled && !!(await auth()).userId;

	return (
		<div className="flex items-center gap-2">
			{signedIn ? (
				<Link
					href="/dashboard"
					prefetch={false}
					target="_top"
					className="inline-flex h-9 items-center justify-center rounded-md border border-primary bg-primary px-3 text-m font-medium text-primary-foreground transition-[background-color,box-shadow] duration-150 ease hover:bg-primary-hover hover:shadow-primary-glow"
				>
					Open workspace
				</Link>
			) : (
				<>
					<Link
						href="/login"
						prefetch={false}
						target="_top"
						className="inline-flex h-9 items-center rounded-md px-3 text-m font-medium text-shell-muted transition-colors duration-150 hover:text-primary"
					>
						Log in
					</Link>

					<Link
						href="/signup"
						prefetch={false}
						target="_top"
						className="inline-flex h-9 items-center justify-center rounded-md border border-primary bg-primary px-3 text-m font-medium text-primary-foreground transition-[background-color,box-shadow] duration-150 ease hover:bg-primary-hover hover:shadow-primary-glow"
					>
						Sign up
					</Link>
				</>
			)}

			<MobileNav />
		</div>
	);
};
