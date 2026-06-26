import { ArrowRight, BanknoteArrowUp, CreditCard, FileClock, SearchCheck, ShieldCheck } from "lucide-react";
import { Panel } from "@/ui/components/Panel";
import { ActionLink } from "./ActionLink";

const SIGNAL_GROUPS = [
	{
		description: "Invoices, renewals, budgets, and spend requests land in one place.",
		icon: BanknoteArrowUp,
		title: "Signals",
	},
	{
		description: "CashLift ranks urgency by runway, due date, value, and owner.",
		icon: ShieldCheck,
		title: "Priority",
	},
	{
		description: "Teams get the next move: collect, approve, hold, or cut.",
		icon: CreditCard,
		title: "Action",
	},
] as const;

const SIGNAL_EXAMPLES = [
	["Overdue invoice", "$18.4k", FileClock],
	["Vendor renewal", "$6.8k", SearchCheck],
	["Spend request", "$9.4k", CreditCard],
] as const;

export const HomeSignalsSection = () => (
	<section className="border-y border-shell-border bg-shell-band">
		<div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8">
			<div className="grid gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-center">
				<header>
					<p className="text-s+ uppercase tracking-normal text-primary">Signals to cash actions</p>

					<h2 className="mt-2 max-w-2xl text-4xl+ tracking-normal text-shell-foreground">
						Turn scattered finance signals into today's cash moves.
					</h2>

					<p className="mt-4 max-w-xl text-m leading-7 text-shell-muted">
						CashLift converts the work finance already tracks into a ranked queue your team can act on.
					</p>

					<ActionLink href="/demo" className="mt-8">
						Run leak audit
						<ArrowRight aria-hidden className="size-4" />
					</ActionLink>
				</header>

				<Panel variant="glass" className="overflow-hidden p-0">
					<div className="grid border-b border-shell-border md:grid-cols-3">
						{SIGNAL_GROUPS.map(({ description, icon: Icon, title }, index) => (
							<div key={title} className="border-shell-border p-5 md:border-r md:last:border-r-0">
								<div className="flex items-center justify-between gap-3">
									<Icon aria-hidden className="size-5 text-primary" />

									{index < SIGNAL_GROUPS.length - 1 && (
										<ArrowRight aria-hidden className="hidden size-4 text-shell-muted md:block" />
									)}
								</div>

								<h3 className="mt-4 text-xl+ text-shell-foreground">{title}</h3>

								<p className="mt-2 text-s leading-5 text-shell-muted">{description}</p>
							</div>
						))}
					</div>

					<ul className="grid gap-3 p-5 sm:grid-cols-3">
						{SIGNAL_EXAMPLES.map(([label, value, Icon]) => (
							<li key={label} className="rounded-lg border border-shell-border bg-white/10 p-3">
								<Icon aria-hidden className="size-5 text-primary" />

								<p className="mt-3 text-m+ text-shell-foreground">{label}</p>

								<p className="mt-1 font-mono text-l+ text-primary">{value}</p>
							</li>
						))}
					</ul>
				</Panel>
			</div>
		</div>
	</section>
);
