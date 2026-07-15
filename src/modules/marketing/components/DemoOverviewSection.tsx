import { DEMO_STEPS } from "../content";
import { ActionLink } from "./ActionLink";
import { Hero } from "./Hero";
import { IconCard } from "./IconCard";

export const DemoOverviewSection = () => (
	<section>
		<Hero
			description="Share your approval, collection, and renewal questions. We’ll use the Studio Nova workspace to show how CashLift would rank them."
			label="Audit walkthrough"
			labelAsHeading
			title="Book an audit walkthrough."
		/>

		<ol className="mt-10 grid gap-4 md:grid-cols-3">
			{DEMO_STEPS.map(({ description, icon: Icon, title }) => (
				<li key={title}>
					<IconCard description={description} Icon={Icon} title={title} />
				</li>
			))}
		</ol>

		<ActionLink href="/demo/workspace" prefetch={false} variant="secondary" className="mt-8">
			Open live demo
		</ActionLink>
	</section>
);
