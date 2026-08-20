"use client";

import type { ReactNode } from "react";
import { cn } from "@/ui/utils/cn";
import { type CockpitAtmosphere, LIQUID_GLASS_LOOK } from "./glassVariants";

type GlassCardProps = {
	atmosphere: CockpitAtmosphere;
	children: ReactNode;
	as?: "article" | "div" | "section";
	className?: string;
	contentClassName?: string;
	intensity?: "active" | "quiet";
};

export const GlassCard = ({
	as = "section",
	atmosphere,
	children,
	className,
	contentClassName,
	intensity = "quiet",
}: GlassCardProps) => {
	const cardClassName = cn(
		"relative isolate overflow-hidden rounded-2xl border ease transition-[border-color,box-shadow] duration-300 motion-reduce:transition-none",
		LIQUID_GLASS_LOOK.cardClassName,
		intensity === "active" ? "border-primary/30" : "border-white/10",
		className,
	);
	const overlayClassName =
		intensity === "active" ? LIQUID_GLASS_LOOK.overlayActiveClassName : LIQUID_GLASS_LOOK.overlayQuietClassName;
	const content = (
		<>
			<div
				aria-hidden
				className={cn("absolute inset-0 bg-cover bg-no-repeat", LIQUID_GLASS_LOOK.atmosphereClassName(atmosphere))}
			/>

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
