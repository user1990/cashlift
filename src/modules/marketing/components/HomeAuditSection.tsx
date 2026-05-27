import { ArrowRight, CheckCircle2, Clock3, ShieldCheck, Sparkles } from "lucide-react";
import { Panel } from "@/ui/components/Panel";
import { ActionLink } from "./ActionLink";

const AUDIT_FINDINGS = [
	["Unused seats", "$1.2k", "Cut before renewal"],
	["Duplicate tools", "$640", "Merge owners"],
	["Late invoice risk", "$18.4k", "Chase today"],
] as const;

const AUDIT_STEPS = [
	{
		description: "Use demo accounting data or connect later.",
		icon: Clock3,
		title: "3-minute setup",
	},
	{
		description: "Rank leaks by cash impact, not noise.",
		icon: Sparkles,
		title: "Prioritized findings",
	},
	{
		description: "Turn each finding into owner and next action.",
		icon: ShieldCheck,
		title: "Action-ready output",
	},
] as const;

export const HomeAuditSection = () => (
	<section className="border-t border-shell-border bg-shell-band">
		<div className="mx-auto grid max-w-[1180px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.85fr_1fr] lg:px-8">
			<header>
				<p className="text-s+ uppercase tracking-normal text-primary">Leak audit</p>

				<h2 className="mt-2 text-4xl+ tracking-normal text-shell-foreground">
					Find your first cash leaks in 3 minutes.
				</h2>

				<p className="mt-4 max-w-xl text-m leading-7 text-shell-muted">
					Run a demo audit and leave with prioritized findings, owners, and next actions.
				</p>

				<ActionLink href="/demo" className="mt-8">
					Run leak audit
					<ArrowRight aria-hidden className="size-4" />
				</ActionLink>
			</header>

			<Panel variant="glass" className="overflow-hidden p-0">
				<div className="border-b border-shell-border p-5">
					<p className="text-s+ uppercase tracking-normal text-primary">Sample audit result</p>

					<h3 className="mt-2 text-3xl+ tracking-normal text-shell-foreground">$20.2k found before payroll week.</h3>
				</div>

				<ul className="divide-y divide-shell-border">
					{AUDIT_FINDINGS.map(([title, value, action]) => (
						<li key={title} className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
							<div className="flex items-start gap-3">
								<CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-signal" />

								<div>
									<h4 className="text-l+ text-shell-foreground">{title}</h4>

									<p className="mt-1 text-m text-shell-muted">{action}</p>
								</div>
							</div>

							<p className="font-mono text-2xl+ text-primary">{value}</p>
						</li>
					))}
				</ul>

				<div className="grid gap-4 border-t border-shell-border p-5 md:grid-cols-3">
					{AUDIT_STEPS.map(({ description, icon: Icon, title }) => (
						<div key={title}>
							<Icon aria-hidden className="size-5 text-primary" />

							<h4 className="mt-3 text-m+ text-shell-foreground">{title}</h4>

							<p className="mt-1 text-s leading-5 text-shell-muted">{description}</p>
						</div>
					))}
				</div>
			</Panel>
		</div>
	</section>
);
