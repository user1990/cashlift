import Link from "next/link";

export const PrototypeFrame = () => (
	<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
		<div className="min-w-0">
			<p className="text-muted-foreground text-s">Design prototype · production overview is unchanged</p>

			<p className="mt-1 font-semibold text-2xl+ text-panel-foreground tracking-normal">Operating cockpit</p>

			<p className="mt-1 max-w-2xl text-m text-shell-muted leading-6">
				Liquid-glass cash desk with header search, work categories, and progressive filters. Phase 3 will promote this
				to production after review.
			</p>
		</div>

		<Link
			className="ease inline-flex min-h-11 items-center rounded-full border border-transparent px-4 font-semibold text-m text-muted-foreground outline-none transition-colors duration-150 hover:text-panel-foreground focus-visible:ring-[3px] focus-visible:ring-primary/20"
			href="/dashboard"
		>
			Production overview
		</Link>
	</div>
);
