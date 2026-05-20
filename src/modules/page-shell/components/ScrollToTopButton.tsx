import { ArrowUp } from "lucide-react";

export const ScrollToTopButton = () => (
	<a
		href="#top"
		aria-label="Scroll to top"
		className="group sticky bottom-6 z-40 mr-4 mt-[100vh] flex size-12 place-self-end items-center justify-center rounded-full border border-shell-border bg-shell-elevated/85 text-shell-muted shadow-shell backdrop-blur transition-[border-color,box-shadow,color,transform] duration-300 ease-out hover:scale-110 hover:border-primary/50 hover:text-primary hover:shadow-primary-glow active:scale-95 sm:mr-6 sm:size-14"
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
