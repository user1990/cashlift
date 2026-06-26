import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Panel } from "@/ui/components/Panel";
import { ActionLink } from "./ActionLink";
import { Hero } from "./Hero";

const CASH_ACTION_PREVIEW_ITEMS = [
	["Critical", "Chase Northstar invoice", "$18.4k"],
	["Critical", "Decide on BrandForge renewal", "$6.8k"],
	["High", "Hold non-essential buys", "$9.4k"],
] as const;

export const HomeHeroSection = () => (
	<section className="relative isolate overflow-hidden border-b border-shell-border bg-shell">
		<div
			aria-hidden
			className="hero-ambient absolute inset-0 bg-[url('/brand/hero-finance-command.svg')] bg-cover bg-center opacity-80"
		/>

		<div aria-hidden className="absolute inset-0 bg-shell/72" />

		<div aria-hidden className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-shell to-transparent" />

		<div className="relative mx-auto grid min-h-[82svh] max-w-[1180px] items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:px-8">
			<header>
				<Hero
					description="CashLift ranks approvals, invoices, vendor leaks, and runway risks in one action queue."
					label="Cash-aware spend decisions"
					title="Know which cash move to make today."
					titleClassName="sm:text-7xl+"
				/>

				<div className="mt-8 flex flex-wrap items-center gap-3">
					<ActionLink href="/demo">
						Run leak audit
						<ArrowRight aria-hidden className="size-4" />
					</ActionLink>

					<ActionLink href="/dashboard" variant="secondary" className="bg-shell-elevated/80">
						Open demo app
					</ActionLink>
				</div>
			</header>

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
);
