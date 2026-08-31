import { Panel } from "@/ui/components/layout/Panel";
import { Hero } from "./Hero";

const CONTACT_CHANNELS = [
	["Sales", "sales@cashlift.example"],
	["Support", "support@cashlift.example"],
] as const;

export const ContactOverviewSection = () => (
	<section>
		<Hero
			label="Contact"
			description="Talk through cash ops for your service team—sales, support, partnerships, and product feedback stay local in demo mode."
			variant="page-title"
		/>

		<ul className="mt-8 grid gap-4 md:grid-cols-2">
			{CONTACT_CHANNELS.map(([label, email]) => (
				<li key={label}>
					<Panel as="article">
						<h2 className="text-m+ text-panel-foreground">{label}</h2>

						<address className="mt-2 text-m text-muted-foreground not-italic">{email}</address>
					</Panel>
				</li>
			))}
		</ul>
	</section>
);
