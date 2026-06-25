"use client";

import { ArrowUp } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/ui/utils/cn";

const SCROLL_TO_TOP_THRESHOLD = 560;

export const ScrollToTopButton = () => {
	const visible = useSyncExternalStore(
		subscribeToScrollVisibility,
		getScrollToTopVisibility,
		getServerScrollToTopVisibility,
	);

	return (
		<a
			href="#top"
			aria-label="Scroll to top"
			tabIndex={visible ? undefined : -1}
			className={cn(
				"group fixed right-4 bottom-6 z-40 flex size-12 items-center justify-center rounded-full border border-shell-border bg-shell-elevated/85 text-shell-muted shadow-shell backdrop-blur transition-[border-color,box-shadow,color,opacity,transform] duration-300 ease-out hover:scale-110 hover:border-primary/50 hover:text-primary hover:shadow-primary-glow active:scale-95 sm:right-6 sm:size-14",
				visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
			)}
		>
			<span
				aria-hidden
				className="absolute inset-2 rounded-full bg-linear-to-br from-primary/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
			/>

			<ArrowUp
				aria-hidden
				className="relative size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-active:-translate-y-1"
			/>
		</a>
	);
};

function subscribeToScrollVisibility(onStoreChange: () => void) {
	window.addEventListener("scroll", onStoreChange, { passive: true });

	return () => {
		window.removeEventListener("scroll", onStoreChange);
	};
}

function getScrollToTopVisibility() {
	return window.scrollY > SCROLL_TO_TOP_THRESHOLD;
}

function getServerScrollToTopVisibility() {
	return false;
}
