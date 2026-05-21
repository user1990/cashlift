import type { ReactNode } from "react";
import { cn } from "@/ui/utils/cn";

type HeroProps = {
	description: ReactNode;
	label: ReactNode;
	title: ReactNode;
	as?: "h1" | "h2";
	className?: string;
	titleClassName?: string;
};

export const Hero = ({ as: Component = "h1", className, description, label, title, titleClassName }: HeroProps) => (
	<div className={className}>
		<p className="text-s+ uppercase tracking-normal text-primary">{label}</p>

		<Component className={cn("mt-4 max-w-3xl text-6xl+ tracking-normal text-shell-foreground", titleClassName)}>
			{title}
		</Component>

		<p className="mt-5 max-w-2xl text-xl leading-8 text-shell-muted">{description}</p>
	</div>
);
