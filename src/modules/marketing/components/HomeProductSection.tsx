import { ChartSpline, CreditCard, FileClock, SearchCheck } from "lucide-react";
import { IconCard } from "./IconCard";

const HOME_FEATURE_CARDS = [
	{
		description: "Show budget room, cash impact, and invoice timing before spend leaves.",
		icon: CreditCard,
		title: "Approve with cash impact",
	},
	{
		description: "Put the highest-risk receivable at the top of today's queue.",
		icon: FileClock,
		title: "Chase the right invoice",
	},
	{
		description: "Spot unused seats, duplicate tools, and renewals before they hit cash.",
		icon: SearchCheck,
		title: "Catch vendor waste",
	},
	{
		description: "See weekly inflows, outflows, payroll pressure, and buffer risk.",
		icon: ChartSpline,
		title: "See runway pressure",
	},
] as const;

export const HomeProductSection = () => (
	<section className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8">
		<header className="max-w-2xl">
			<p className="text-s+ uppercase tracking-normal text-primary">Product</p>

			<h2 className="mt-2 text-4xl+ tracking-normal text-shell-foreground">
				The core cash workflows, stripped down to action.
			</h2>
		</header>

		<ul className="mt-8 grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-4">
			{HOME_FEATURE_CARDS.map(({ description, icon: Icon, title }) => (
				<li key={title}>
					<IconCard description={description} Icon={Icon} title={title} />
				</li>
			))}
		</ul>
	</section>
);
