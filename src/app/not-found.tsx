import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ActionLink } from "@/modules/marketing/components/ActionLink";
import { Shell } from "@/modules/marketing/components/Shell";
import { MainContent } from "@/modules/page-shell/components/MainContent";

export default function NotFound() {
	return (
		<Shell footerVariant="compact">
			<MainContent
				className="relative isolate flex min-h-[calc(100svh-4rem)] flex-1 items-center justify-center overflow-hidden bg-shell px-0 py-0"
				variant="plain"
			>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 bg-[url('/marketing/404-glass-bg.webp')] bg-center bg-cover opacity-75"
				/>

				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,transparent_12%,rgb(4_10_18_/_0.58)_72%),linear-gradient(180deg,rgb(4_10_18_/_0.12),rgb(4_10_18_/_0.62))]"
				/>

				<section className="relative z-10 mx-4 w-full max-w-3xl overflow-hidden rounded-3xl border border-white/15 bg-shell/30 px-5 py-8 text-center shadow-[inset_0_1px_0_rgb(255_255_255_/_0.12),0_24px_80px_rgb(0_0_0_/_0.38)] backdrop-blur-md sm:mx-6 sm:px-10 sm:py-10">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-x-1/4 top-0 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent"
					/>

					<p className="font-mono text-primary text-xs uppercase tracking-[0.2em]">Route reconciliation / 404</p>

					<h1 className="mt-5 bg-linear-to-b from-shell-foreground via-primary/75 to-primary/35 bg-clip-text font-mono font-semibold text-[clamp(8rem,31vw,24rem)] text-transparent leading-[0.72] tracking-[-0.08em] drop-shadow-[0_0_45px_rgb(2_218_235_/_0.24)]">
						404
					</h1>

					<p className="mt-8 text-2xl+ leading-8 tracking-normal sm:text-3xl+">This page didn’t make the forecast.</p>

					<p className="mx-auto mt-3 max-w-md text-shell-muted text-xl leading-7">
						Good news: your cash is still accounted for. This route isn’t.
					</p>

					<ActionLink href="/" className="mt-8">
						Back to CashLift
						<ArrowUpRight aria-hidden className="size-4" />
					</ActionLink>

					<nav
						aria-label="Additional recovery options"
						className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-m text-shell-muted"
					>
						<Link className="transition-colors hover:text-primary focus-visible:text-primary" href="/help">
							Help
						</Link>

						<Link className="transition-colors hover:text-primary focus-visible:text-primary" href="/sitemap.xml">
							Sitemap
						</Link>

						<Link className="transition-colors hover:text-primary focus-visible:text-primary" href="/llms.txt">
							Agent guidance
						</Link>
					</nav>
				</section>
			</MainContent>
		</Shell>
	);
}
