import { ArrowRight, ArrowUpRight } from "lucide-react";
import { HOME_HERO } from "../site";
import { ActionLink } from "./ActionLink";
import { HomeHeroImage } from "./HomeHeroImage";

export const HomeHeroSection = () => (
	<section className="relative isolate overflow-clip border-shell-border border-b bg-shell">
		<div
			aria-hidden
			data-home-hero-parallax="atmosphere"
			className="pointer-events-none absolute -inset-8 bg-[radial-gradient(circle_at_50%_12%,color-mix(in_srgb,var(--primary)_18%,transparent),transparent_31%),radial-gradient(circle_at_82%_40%,color-mix(in_srgb,var(--highlight)_14%,transparent),transparent_30%),radial-gradient(circle_at_16%_72%,color-mix(in_srgb,var(--signal)_9%,transparent),transparent_27%)]"
		/>

		<div className="relative mx-auto max-w-295 px-4 pt-16 pb-14 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24 lg:pb-20">
			<header className="mx-auto max-w-4xl text-center">
				<h1 aria-label={HOME_HERO.heading} className="text-5xl+ tracking-normal sm:text-7xl+">
					<span className="block text-shell-foreground">See what to </span>

					<span className="block text-primary">collect, approve, </span>

					<span className="block text-signal">or cut today.</span>
				</h1>

				<p className="mx-auto mt-6 max-w-2xl text-l text-shell-muted leading-8">{HOME_HERO.subtitle}</p>

				<div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
					<ActionLink href={HOME_HERO.ctaDemoHref} prefetch={false}>
						{HOME_HERO.ctaDemoLabel}
						<ArrowRight aria-hidden className="size-4" />
					</ActionLink>

					<ActionLink href={HOME_HERO.ctaDocumentationHref} variant="secondary">
						{HOME_HERO.ctaDocumentationLabel}
						<ArrowUpRight aria-hidden className="size-4" />
					</ActionLink>
				</div>
			</header>

			<div className="relative mx-auto mt-10 max-w-280 sm:mt-12 lg:mt-14 lg:pb-6">
				<div
					aria-hidden
					data-home-hero-parallax="midground"
					className="pointer-events-none absolute -inset-x-[3%] inset-y-[3%] hidden lg:block"
				>
					<div className="absolute inset-y-[8%] left-0 w-[42%] -rotate-3 rounded-3xl border border-primary/20 bg-primary-subtle/15 shadow-shell backdrop-blur-md" />

					<div className="absolute inset-y-[4%] right-0 w-[38%] rotate-3 rounded-3xl border border-highlight/15 bg-highlight-subtle/20 shadow-shell backdrop-blur-md" />
				</div>

				<div data-home-hero-parallax="product" className="relative z-20">
					<HomeHeroImage />
				</div>

				<div
					aria-hidden
					data-home-hero-parallax="foreground"
					className="pointer-events-none absolute inset-x-[4%] -bottom-2 z-30 hidden h-20 lg:block"
				>
					<div className="absolute inset-x-[2%] bottom-0 h-20 bg-[radial-gradient(ellipse_at_50%_100%,color-mix(in_srgb,var(--primary)_58%,transparent),color-mix(in_srgb,var(--primary)_24%,transparent)_46%,transparent_78%)] blur-xl" />

					<div className="absolute inset-x-0 bottom-0 h-px bg-primary shadow-[0_0_20px_4px_color-mix(in_srgb,var(--primary)_80%,transparent)]" />
				</div>
			</div>
		</div>
	</section>
);
