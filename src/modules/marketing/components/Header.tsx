import { Suspense } from "react";
import { DesktopNav } from "./DesktopNav";
import { HeaderActions } from "./HeaderActions";
import { Logo } from "./Logo";

export const Header = () => (
	<header className="sticky top-0 z-30 border-b border-shell-border bg-shell/90 backdrop-blur">
		<div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
			<Logo />

			<DesktopNav />

			<Suspense fallback={null}>
				<HeaderActions />
			</Suspense>
		</div>
	</header>
);
