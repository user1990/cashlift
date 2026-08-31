import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ActionLink } from "./ActionLink";
import { HomeHeroImage } from "./HomeHeroImage";

export const HomeHeroSection = () => (
	<section className="relative isolate overflow-hidden border-shell-border border-b bg-shell">
		<div
			aria-hidden
			className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_32%),radial-gradient(circle_at_82%_36%,color-mix(in_srgb,var(--highlight)_12%,transparent),transparent_28%)]"
		/>

		<div className="relative mx-auto max-w-295 px-4 pt-16 pb-12 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24 lg:pb-16">
			<header className="mx-auto max-w-4xl text-center">
				<h1 className="text-5xl+ tracking-normal sm:text-7xl+">
					<span className="block text-shell-foreground">See what to </span>

					<span className="block text-primary">collect, approve, </span>

					<span className="block text-signal">or cut today.</span>
				</h1>

				<p className="mx-auto mt-6 max-w-2xl text-l text-shell-muted leading-8">
					CashLift ranks the cash actions that matter now in one daily inbox.
				</p>

				<div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
					<ActionLink href="/demo/workspace" prefetch={false}>
						Open live demo
						<ArrowRight aria-hidden className="size-4" />
					</ActionLink>

					<ActionLink href="https://cashlift-docs.vercel.app/" variant="secondary">
						View Documentation
						<ArrowUpRight aria-hidden className="size-4" />
					</ActionLink>
				</div>
			</header>

			<div className="relative mx-auto mt-10 max-w-280 sm:mt-12">
				<div
					aria-hidden
					className="absolute inset-x-[6%] bottom-0 h-20 bg-[radial-gradient(ellipse_at_50%_100%,color-mix(in_srgb,var(--primary)_62%,transparent),color-mix(in_srgb,var(--primary)_30%,transparent)_46%,transparent_78%)] blur-2xl lg:bottom-7"
				/>

				<div
					aria-hidden
					className="absolute inset-x-[4%] bottom-0 h-px bg-primary shadow-[0_0_20px_4px_color-mix(in_srgb,var(--primary)_90%,transparent)] lg:bottom-7"
				/>

				<HomeHeroImage />
			</div>
		</div>
	</section>
);
