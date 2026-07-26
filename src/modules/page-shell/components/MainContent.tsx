import type { ReactNode } from "react";
import { cn } from "@/ui/utils/cn";

type MainContentVariant = "marketing" | "plain" | "workspace";

type MainContentProps = {
	children: ReactNode;
	variant?: MainContentVariant;
	className?: string;
};

const MAIN_CONTENT_VARIANTS = {
	plain: "",
	workspace: "min-h-dvh bg-shell text-shell-foreground",
	marketing: "mx-auto w-full max-w-295 px-4 py-14 sm:px-6 lg:px-8 lg:py-20",
} as const satisfies Record<MainContentVariant, string>;

export const MAIN_CONTENT_ID = "main-content";

export const MainContent = ({ children, className, variant = "plain" }: MainContentProps) => (
	<main id={MAIN_CONTENT_ID} className={cn(MAIN_CONTENT_VARIANTS[variant], className)}>
		{children}
	</main>
);
