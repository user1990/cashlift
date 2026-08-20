"use client";

import { createContext, type ReactNode, useContext } from "react";
import { cn } from "@/ui/utils/cn";
import { type CockpitAtmosphere, DEFAULT_GLASS_VARIANT, GLASS_VARIANTS, type GlassVariantId } from "./glassVariants";

type GlassCardProps = {
	atmosphere: CockpitAtmosphere;
	children: ReactNode;
	as?: "article" | "div" | "section";
	className?: string;
	contentClassName?: string;
	intensity?: "active" | "quiet";
};

const GlassVariantContext = createContext<GlassVariantId>(DEFAULT_GLASS_VARIANT);

export const GlassVariantProvider = ({ children, variant }: { children: ReactNode; variant: GlassVariantId }) => (
	<GlassVariantContext.Provider value={variant}>{children}</GlassVariantContext.Provider>
);

export const GlassCard = ({
	as = "section",
	atmosphere,
	children,
	className,
	contentClassName,
	intensity = "quiet",
}: GlassCardProps) => {
	const variant = useContext(GlassVariantContext);
	const look = GLASS_VARIANTS[variant];
	const cardClassName = cn(
		"relative isolate overflow-hidden rounded-2xl border ease transition-[border-color,box-shadow] duration-300 motion-reduce:transition-none",
		look.cardClassName,
		intensity === "active" ? "border-primary/30" : "border-white/10",
		className,
	);
	const overlayClassName = intensity === "active" ? look.overlayActiveClassName : look.overlayQuietClassName;
	const content = (
		<>
			<div aria-hidden className={cn("absolute inset-0 bg-cover bg-no-repeat", look.atmosphereClassName(atmosphere))} />

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
