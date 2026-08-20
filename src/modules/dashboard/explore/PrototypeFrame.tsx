"use client";

import Link from "next/link";
import { cn } from "@/ui/utils/cn";
import { GLASS_VARIANT_IDS, GLASS_VARIANTS, type GlassVariantId } from "./glassVariants";

type PrototypeFrameProps = {
	onVariantChange: (variant: GlassVariantId) => void;
	variant: GlassVariantId;
};

export const PrototypeFrame = ({ onVariantChange, variant }: PrototypeFrameProps) => (
	<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
		<div className="min-w-0">
			<p className="text-muted-foreground text-s">Design prototype · production overview is unchanged</p>

			<p className="mt-1 font-semibold text-2xl+ text-panel-foreground tracking-normal">Operating cockpit</p>

			<p className="mt-1 max-w-2xl text-m text-shell-muted leading-6">
				Liquid-glass cash desk with header search, work categories, and progressive filters. Phase 3 will promote this
				to production after review.
			</p>
		</div>

		<div className="flex flex-col gap-3 lg:items-end">
			<fieldset className="flex flex-wrap gap-2 border-0 p-0 lg:justify-end">
				<legend className="sr-only">Glass card look</legend>

				{GLASS_VARIANT_IDS.map((variantId) => {
					const selected = variantId === variant;

					return (
						<button
							key={variantId}
							aria-pressed={selected}
							onClick={() => onVariantChange(variantId)}
							type="button"
							className={cn(
								"ease inline-flex min-h-11 items-center rounded-full border px-4 font-semibold text-m outline-none transition-[border-color,color] duration-150 focus-visible:ring-[3px] focus-visible:ring-primary/20 motion-reduce:transition-none",
								selected
									? "border-primary/40 text-panel-foreground"
									: "border-transparent text-muted-foreground hover:text-panel-foreground",
							)}
						>
							{GLASS_VARIANTS[variantId].label}
						</button>
					);
				})}
			</fieldset>

			<Link
				className="ease inline-flex min-h-11 items-center rounded-full border border-transparent px-4 font-semibold text-m text-muted-foreground outline-none transition-colors duration-150 hover:text-panel-foreground focus-visible:ring-[3px] focus-visible:ring-primary/20"
				href="/dashboard"
			>
				Production overview
			</Link>
		</div>
	</div>
);
