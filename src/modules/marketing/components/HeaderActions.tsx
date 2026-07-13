import Link from "next/link";
import { MobileNav } from "./MobileNav";

export const HeaderActions = () => (
	<div className="flex items-center gap-2">
		<Link
			href="/login"
			prefetch={false}
			target="_top"
			className="hidden h-9 items-center rounded-md px-3 text-m font-medium text-shell-muted transition-colors duration-150 hover:text-primary sm:inline-flex"
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

		<MobileNav />
	</div>
);
