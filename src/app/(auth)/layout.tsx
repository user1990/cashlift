import Link from "next/link";
import { MainContent } from "@/modules/page-shell/components/MainContent";

type AuthRouteLayoutProps = {
	children: React.ReactNode;
};

export default function AuthRouteLayout({ children }: AuthRouteLayoutProps) {
	return (
		<div className="grid min-h-dvh grid-rows-[auto_1fr] bg-shell text-shell-foreground">
			<header className="px-4 py-4 sm:px-6">
				<Link
					href="/"
					aria-label="CashLift home"
					className="-mx-3 inline-flex min-h-11 items-center rounded-md px-3 text-m+ font-semibold tracking-normal text-shell-foreground outline-none transition-colors duration-150 hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary/20"
				>
					CashLift
				</Link>
			</header>

			<MainContent className="grid min-h-0 place-items-center px-4 py-8 sm:px-6">
				<section aria-label="Authentication">{children}</section>
			</MainContent>
		</div>
	);
}
