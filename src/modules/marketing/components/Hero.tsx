import type { ReactNode } from "react";
import { cn } from "@/ui/utils/cn";

type HeroBaseProps = {
	as?: "h1" | "h2";
	className?: string;
	label: ReactNode;
	titleClassName?: string;
};

type DefaultHeroProps = HeroBaseProps & {
	description: ReactNode;
	labelAsHeading?: boolean;
	title: ReactNode;
	variant?: "default";
};

type PageTitleHeroProps = HeroBaseProps & {
	description: ReactNode;
	labelAsHeading?: never;
	title?: never;
	variant: "page-title";
};

type HeroProps = DefaultHeroProps | PageTitleHeroProps;

export const Hero = ({
	as: Component = "h1",
	className,
	description,
	label,
	labelAsHeading = false,
	title,
	titleClassName,
	variant = "default",
}: HeroProps) => (
	<div className={className}>
		{variant === "page-title" ? (
			<>
				<Component className={cn("max-w-3xl text-4xl+ text-primary tracking-normal sm:text-6xl+", titleClassName)}>
					{label}
				</Component>

				<p className="mt-5 max-w-2xl text-shell-foreground text-xl leading-8">{description}</p>
			</>
		) : labelAsHeading ? (
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

		{variant === "default" && <p className="mt-5 max-w-2xl text-shell-muted text-xl leading-8">{description}</p>}
	</div>
);
