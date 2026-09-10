import { Panel } from "@/ui/components/layout/Panel";
import { cn } from "@/ui/utils/cn";
import { Hero } from "./Hero";

const CONTACT_CHANNELS = [
	{
		description: "For new business, partnerships, and product fit.",
		email: "sales@cashlift.example",
		label: "Sales",
	},
	{
		description: "For product help, troubleshooting, and account questions.",
		email: "support@cashlift.example",
		label: "Support",
	},
] as const;

export const ContactOverviewSection = () => (
	<section>
		<Hero
			label="Contact"
			description="Talk through cash ops for your service team—sales, support, partnerships, and product feedback stay local in demo mode."
			variant="page-title"
		/>

		<p className="mt-5 max-w-2xl text-shell-muted leading-7">
			Use the form to request a CashLift walkthrough, ask about the read-only Studio Nova sample, or explain the cash
			decision workflow you want to evaluate. The public demo is separate from production workspaces, so do not send
			private company records or real financial credentials through the demo. A walkthrough can cover collections,
			approvals, vendor costs, budgets, and cash warnings with the evidence that supports each next step.
		</p>

		<ul className="mt-8 grid gap-3 md:grid-cols-2">
			{CONTACT_CHANNELS.map(({ description, email, label }) => (
				<li key={label} className="h-full">
					<Panel
						as="article"
						variant="glass"
						className={cn(
							"h-full bg-shell/40 p-4 shadow-none backdrop-blur-none",
							"ease transition-[background-color,border-color] duration-150 hover:border-primary/40 hover:bg-shell/60",
						)}
					>
						<h2 className="text-m+ text-primary">{label}</h2>

						<address className="mt-2 text-m text-shell-foreground not-italic">{email}</address>

						<p className="mt-1 text-muted-foreground text-s">{description}</p>
					</Panel>
				</li>
			))}
		</ul>
	</section>
);
