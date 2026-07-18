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
						"max-w-3xl text-4xl font-semibold tracking-normal text-shell-foreground sm:text-6xl",
						titleClassName,
					)}
				>
					{label}
				</Component>

				<p className="mt-4 max-w-3xl text-3xl+ leading-tight tracking-normal text-shell-foreground">{title}</p>
			</>
		) : (
			<>
				<p className="text-s+ uppercase tracking-normal text-primary">{label}</p>

				<Component className={cn("mt-4 max-w-3xl text-6xl+ tracking-normal text-shell-foreground", titleClassName)}>
					{title}
				</Component>
			</>
		)}

		<p className="mt-5 max-w-2xl text-xl leading-8 text-shell-muted">{description}</p>
	</div>
);
