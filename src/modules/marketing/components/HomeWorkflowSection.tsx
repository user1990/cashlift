import { BanknoteArrowUp, CreditCard, FileClock, SearchCheck } from "lucide-react";
import { Panel } from "@/ui/components/Panel";
import { HomeCashFlowIllustration } from "./HomeCashFlowIllustration";

const WORKFLOW_STEPS = [
	{
		description: "Bring the money signals into one daily view.",
		icon: BanknoteArrowUp,
		title: "Capture",
	},
	{
		description: "Rank work by cash impact and urgency.",
		icon: SearchCheck,
		title: "Prioritize",
	},
	{
		description: "Give each owner a clear next move.",
		icon: CreditCard,
		title: "Act",
	},
	{
		description: "Track owners and runway without spreadsheet chasing.",
		icon: FileClock,
		title: "Review",
	},
] as const;

export const HomeWorkflowSection = () => (
	<section className="mx-auto grid max-w-[1180px] gap-8 px-4 pb-14 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
		<div>
			<p className="text-s+ uppercase tracking-normal text-primary">How it works</p>

			<h2 className="mt-2 text-4xl+ tracking-normal text-shell-foreground">
				A daily operating rhythm for cash decisions.
			</h2>

			<p className="mt-4 max-w-xl text-m leading-7 text-shell-muted">
				Every signal becomes an owner, a priority, and a next action.
			</p>

			<ol className="mt-8 grid gap-4 sm:grid-cols-2">
				{WORKFLOW_STEPS.map(({ description, icon: Icon, title }) => (
					<li key={title}>
						<Panel as="article" className="h-full">
							<Icon aria-hidden className="size-5 text-primary" />

							<h3 className="mt-4 text-xl+ text-panel-foreground">{title}</h3>

							<p className="mt-2 text-m leading-6 text-muted-foreground">{description}</p>
						</Panel>
					</li>
				))}
			</ol>
		</div>

		<HomeCashFlowIllustration />
	</section>
);
