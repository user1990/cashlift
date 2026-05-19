import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ShellContainer } from "@/modules/page-shell/components/ShellContainer";
import { ShellSection } from "@/modules/page-shell/components/ShellSection";
import { Panel } from "@/ui/components/Panel";
import { FEATURE_CARDS, PROOF_POINTS } from "../content";
import { MarketingIconCard } from "./MarketingIconCard";

const CASH_ACTION_PREVIEW_ITEMS = [
	["Critical", "Chase Northstar invoice", "$18.4k"],
	["Critical", "Decide on BrandForge renewal", "$6.8k"],
	["High", "Cut unused Notion seats", "$1.26k"],
	["High", "Hold non-essential buys until payroll", "$9.4k"],
] as const;

export const HomePage = () => (
	<main id="main-content">
		<section className="relative isolate overflow-hidden border-b border-shell-border bg-shell">
			<div
				aria-hidden
				className="hero-ambient absolute inset-0 bg-[url('/brand/hero-finance-command.svg')] bg-cover bg-center opacity-80"
			/>

			<div aria-hidden className="absolute inset-0 bg-shell/72" />

			<div aria-hidden className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-shell to-transparent" />

			<div className="relative mx-auto grid min-h-[82svh] max-w-[1180px] items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:px-8">
				<div>
					<p className="text-s+ uppercase tracking-normal text-primary">Cash-aware spend decisions</p>

					<h1 className="mt-4 max-w-3xl text-6xl+ tracking-normal text-shell-foreground sm:text-7xl+">
						Approve spend, chase cash, and prevent leaks before money leaves.
					</h1>

					<p className="mt-5 max-w-2xl text-xl leading-8 text-shell-muted">
						CashLift gives service firms one daily command center for cash actions: approvals, receivables, vendor
						leaks, budgets, and runway.
					</p>

					<div className="mt-8 flex flex-wrap items-center gap-3">
						<Link
							href="/demo"
							className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 text-m font-medium text-primary-foreground transition-[background-color,box-shadow] duration-150 ease hover:bg-primary-hover hover:shadow-primary-glow"
						>
							Run leak audit
							<ArrowRight aria-hidden className="size-4" />
						</Link>

						<Link
							href="/app"
							className="inline-flex h-11 items-center justify-center rounded-md border border-shell-border bg-shell-elevated/80 px-4 text-m font-medium text-shell-foreground transition-[border-color,color] duration-150 ease hover:border-primary-subtle-border hover:text-primary"
						>
							Open demo app
						</Link>
					</div>
				</div>

				<div className="self-start">
					<Panel variant="glass">
						<div className="mb-4">
							<p className="mb-1 text-2xs+ uppercase tracking-normal text-primary">Today&apos;s CashLift</p>

							<h2 className="text-l+ text-shell-foreground">Studio Nova action inbox</h2>
						</div>

						<ul className="space-y-3">
							{CASH_ACTION_PREVIEW_ITEMS.map(([priority, title, value]) => (
								<li
									key={title}
									className="flex items-center justify-between gap-4 rounded-lg border border-shell-border bg-white/10 p-3"
								>
									<div className="flex items-center gap-3">
										<CheckCircle2 aria-hidden className="size-5 shrink-0 text-signal" />

										<div>
											<p className="text-m+ text-shell-foreground">{title}</p>

											<p className="text-s text-shell-muted">{priority}</p>
										</div>
									</div>

									<span className="font-mono text-m+ text-primary">{value}</span>
								</li>
							))}
						</ul>
					</Panel>
				</div>
			</div>
		</section>

		<ShellSection className="bg-cyan-950">
			<ShellContainer className="py-8 sm:px-6 md:grid-cols-3 lg:px-8">
				<ul className="contents">
					{PROOF_POINTS.map(({ metric, text }) => (
						<li key={metric}>
							<dl>
								<dt className="sr-only">Proof point</dt>

								<dd className="font-mono text-4xl+ text-primary">{metric}</dd>
							</dl>

							<p className="mt-2 text-m leading-6 text-shell-muted">{text}</p>
						</li>
					))}
				</ul>
			</ShellContainer>
		</ShellSection>

		<section className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8">
			<div className="max-w-2xl">
				<p className="text-s+ uppercase tracking-normal text-primary">Product</p>

				<h2 className="mt-2 text-4xl+ tracking-normal text-shell-foreground">
					Everything daily cash ops needs for the first MVP.
				</h2>
			</div>

			<ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{FEATURE_CARDS.map(({ description, icon: Icon, title }) => (
					<li key={title}>
						<MarketingIconCard description={description} Icon={Icon} title={title} />
					</li>
				))}
			</ul>
		</section>
	</main>
);
