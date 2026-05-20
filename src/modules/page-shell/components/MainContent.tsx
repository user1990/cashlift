import type { ReactNode } from "react";
import { cn } from "@/ui/utils/cn";

type MainContentVariant = "marketing" | "plain" | "workspace";

type MainContentProps = {
	variant: MainContentVariant;
	children: ReactNode;
	className?: string;
};

const MAIN_CONTENT_VARIANTS = {
	marketing: "mx-auto max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20",
	plain: undefined,
	workspace: "min-h-screen bg-shell text-shell-foreground",
} as const satisfies Record<MainContentVariant, string | undefined>;

export const MainContent = ({ children, className, variant }: MainContentProps) => (
	<main id="main-content" className={cn(MAIN_CONTENT_VARIANTS[variant], className)}>
		{children}
	</main>
);
