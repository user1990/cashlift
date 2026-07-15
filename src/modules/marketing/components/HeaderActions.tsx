import Link from "next/link";
import { MobileNav } from "./MobileNav";

export const HeaderActions = () => (
	<div className="flex items-center gap-1 sm:gap-2">
		<Link
			href="/login"
			prefetch={false}
			target="_top"
			className="inline-flex h-9 items-center rounded-md px-2 text-s font-medium text-shell-muted transition-colors duration-150 hover:text-primary sm:px-3 sm:text-m"
		>
			Log in
		</Link>

		<Link
			href="/demo/workspace"
			prefetch={false}
			className="hidden h-9 items-center justify-center whitespace-nowrap rounded-md border border-primary bg-primary px-3 text-m font-medium text-primary-foreground transition-[background-color,box-shadow] duration-150 ease hover:bg-primary-hover hover:shadow-primary-glow sm:inline-flex"
		>
			Open live demo
		</Link>

		<MobileNav />
	</div>
);
