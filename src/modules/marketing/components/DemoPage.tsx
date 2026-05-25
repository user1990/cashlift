import { MainContent } from "@/modules/page-shell/components/MainContent";
import { Panel, PanelHeader } from "@/ui/components/Panel";
import { DEMO_STEPS } from "../content";
import { ActionLink } from "./ActionLink";
import { Hero } from "./Hero";
import { IconCard } from "./IconCard";
import { LeadCaptureForm } from "./LeadCaptureForm";

export const DemoPage = () => (
	<MainContent variant="marketing" className="grid gap-8 lg:grid-cols-[1fr_0.78fr]">
		<div>
			<Hero
				description="See how CashLift turns accounting-style data into approvals, collections, vendor cuts, and cash buffer decisions."
				label="Demo"
				labelAsHeading
				title="Run a cash leak audit before you invite the team."
			/>

			<ol className="mt-10 grid gap-4 md:grid-cols-3">
				{DEMO_STEPS.map(({ description, icon: Icon, title }) => (
					<li key={title}>
						<IconCard description={description} Icon={Icon} title={title} />
					</li>
				))}
			</ol>

			<ActionLink href="/dashboard" variant="secondary" className="mt-8">
				Open interactive demo app
			</ActionLink>
		</div>

		<Panel className="flex flex-col">
			<PanelHeader label="Book demo" title="Get the audit walkthrough" />

			<LeadCaptureForm buttonLabel="Book demo" />
		</Panel>
	</MainContent>
);
