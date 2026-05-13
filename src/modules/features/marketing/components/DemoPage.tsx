import Link from "next/link";
import { Panel, PanelHeader } from "@/modules/ui/components/Panel";
import { DEMO_STEPS } from "../content";
import { LeadCaptureForm } from "./LeadCaptureForm";
import { MarketingIconCard } from "./MarketingIconCard";

export const DemoPage = () => (
	<main className="mx-auto grid max-w-[1180px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.78fr] lg:px-8 lg:py-20">
		<div>
			<p className="text-s+ uppercase tracking-normal text-primary">Demo</p>

			<h1 className="mt-4 max-w-3xl text-6xl+ tracking-normal text-shell-foreground">
				Run a cash leak audit before you invite the team.
			</h1>

			<p className="mt-5 max-w-2xl text-xl leading-8 text-shell-muted">
				See how CashLift turns accounting-style data into approvals, collections, vendor cuts, and cash buffer
				decisions.
			</p>

			<ol className="mt-10 grid gap-4 md:grid-cols-3">
				{DEMO_STEPS.map(({ description, icon: Icon, title }) => (
					<li key={title}>
						<MarketingIconCard description={description} Icon={Icon} title={title} />
					</li>
				))}
			</ol>

			<Link
				className="mt-8 inline-flex h-11 items-center justify-center rounded-md border border-shell-border bg-shell-elevated px-4 text-m font-medium text-shell-foreground transition-[border-color,color] duration-150 ease hover:border-primary-subtle-border hover:text-primary"
				href="/app"
			>
				Open interactive demo app
			</Link>
		</div>

		<Panel>
			<PanelHeader eyebrow="Book demo" title="Get the audit walkthrough" />

			<LeadCaptureForm buttonLabel="Book demo" />
		</Panel>
	</main>
);
