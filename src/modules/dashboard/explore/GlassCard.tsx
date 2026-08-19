import type { ReactNode } from "react";
import { cn } from "@/ui/utils/cn";

type GlassCardProps = {
	atmosphereClassName: string;
	children: ReactNode;
	as?: "article" | "div" | "section";
	className?: string;
	contentClassName?: string;
	intensity?: "active" | "quiet";
};

export const GlassCard = ({
	as = "section",
	atmosphereClassName,
	children,
	className,
	contentClassName,
	intensity = "quiet",
}: GlassCardProps) => {
	const cardClassName = cn(
		"relative isolate overflow-hidden rounded-2xl border shadow-shell",
		intensity === "active" ? "border-primary/30" : "border-white/10",
		className,
	);
	const overlayClassName =
		intensity === "active"
			? "absolute inset-0 bg-shell/50 backdrop-blur-2xl"
			: "absolute inset-0 bg-shell/70 backdrop-blur-2xl";
	const content = (
		<>
			<div aria-hidden className={cn("absolute inset-0 bg-cover bg-no-repeat", atmosphereClassName)} />

			<div aria-hidden className={overlayClassName} />

			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/35 to-transparent"
			/>

			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgb(255_255_255/0.12)]"
			/>

			<div className={cn("relative z-10 p-5 sm:p-6", contentClassName)}>{children}</div>
		</>
	);

	if (as === "article") {
		return <article className={cardClassName}>{content}</article>;
	}

	if (as === "div") {
		return <div className={cardClassName}>{content}</div>;
	}

	return <section className={cardClassName}>{content}</section>;
};
