import type { ReactNode } from "react";
import { cn } from "@/ui/utils/cn";

type HeroProps = {
	description: ReactNode;
	label: ReactNode;
	title: ReactNode;
	as?: "h1" | "h2";
	className?: string;
	labelAsHeading?: boolean;
	titleClassName?: string;
};

export const Hero = ({
	as: Component = "h1",
	className,
	description,
	label,
	labelAsHeading = false,
	title,
	titleClassName,
}: HeroProps) => (
	<div className={className}>
		{labelAsHeading ? (
			<>
				<Component
					className={cn(
						"max-w-3xl font-semibold text-4xl tracking-normal sm:text-6xl+",
						Component === "h1" ? "text-primary" : "text-shell-foreground",
						titleClassName,
					)}
				>
					{label}
				</Component>

				<p className="mt-4 max-w-3xl text-3xl+ text-shell-foreground leading-tight tracking-normal">{title}</p>
			</>
		) : (
			<>
				<p className="text-primary text-s+ uppercase tracking-normal">{label}</p>

				<Component
					className={cn(
						"mt-4 max-w-3xl text-6xl+ tracking-normal",
						Component === "h1" ? "text-primary" : "text-shell-foreground",
						titleClassName,
					)}
				>
					{title}
				</Component>
			</>
		)}

		<p className="mt-5 max-w-2xl text-shell-muted text-xl leading-8">{description}</p>
	</div>
);
