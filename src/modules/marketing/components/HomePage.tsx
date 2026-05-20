import { ArrowRight, CheckCircle2 } from "lucide-react";
import { MainContent } from "@/modules/page-shell/components/MainContent";
import { ScrollToTopButton } from "@/modules/page-shell/components/ScrollToTopButton";
import { ShellContainer } from "@/modules/page-shell/components/ShellContainer";
import { ShellSection } from "@/modules/page-shell/components/ShellSection";
import { Panel } from "@/ui/components/Panel";
import { FEATURE_CARDS, PROOF_POINTS } from "../content";
import { MarketingActionLink } from "./MarketingActionLink";
import { MarketingHero } from "./MarketingHero";
import { MarketingIconCard } from "./MarketingIconCard";
import { MarketingProofList } from "./MarketingProofList";

const CASH_ACTION_PREVIEW_ITEMS = [
	["Critical", "Chase Northstar invoice", "$18.4k"],
	["Critical", "Decide on BrandForge renewal", "$6.8k"],
	["High", "Cut unused Notion seats", "$1.26k"],
	["High", "Hold non-essential buys until payroll", "$9.4k"],
] as const;

export const HomePage = () => (
	<MainContent variant="plain">
		<section className="relative isolate overflow-hidden border-b border-shell-border bg-shell">
			<div
				aria-hidden
				className="hero-ambient absolute inset-0 bg-[url('/brand/hero-finance-command.svg')] bg-cover bg-center opacity-80"
			/>

			<div aria-hidden className="absolute inset-0 bg-shell/72" />

			<div aria-hidden className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-shell to-transparent" />

			<div className="relative mx-auto grid min-h-[82svh] max-w-[1180px] items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:px-8">
				<div>
					<MarketingHero
						description="CashLift gives service firms one daily command center for cash actions: approvals, receivables, vendor leaks, budgets, and runway."
						label="Cash-aware spend decisions"
						title="Approve spend, chase cash, and prevent leaks before money leaves."
						titleClassName="sm:text-7xl+"
					/>

					<div className="mt-8 flex flex-wrap items-center gap-3">
						<MarketingActionLink href="/demo">
							Run leak audit
							<ArrowRight aria-hidden className="size-4" />
						</MarketingActionLink>

						<MarketingActionLink href="/dashboard" variant="secondary" className="bg-shell-elevated/80">
							Open demo app
						</MarketingActionLink>
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
				<MarketingProofList items={PROOF_POINTS} variant="shell" />
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

		<ScrollToTopButton />
	</MainContent>
);
