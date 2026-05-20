import { MainContent } from "@/modules/page-shell/components/MainContent";
import { Panel, PanelHeader } from "@/ui/components/Panel";
import { LeadCaptureForm } from "./LeadCaptureForm";
import { MarketingHero } from "./MarketingHero";

export const ContactPage = () => (
	<MainContent variant="marketing" className="grid gap-8 lg:grid-cols-[1fr_0.78fr]">
		<div>
			<MarketingHero
				description="Use this MVP contact page for sales, support, partnerships, and product feedback. Submissions stay local in demo mode."
				label="Contact"
				title="Talk through cash ops for your service team."
			/>

			<ul className="mt-8 grid gap-4 md:grid-cols-2">
				<li>
					<Panel as="article">
						<h2 className="text-m+ text-panel-foreground">Sales</h2>

						<address className="mt-2 text-m text-muted-foreground not-italic">sales@cashlift.example</address>
					</Panel>
				</li>

				<li>
					<Panel as="article">
						<h2 className="text-m+ text-panel-foreground">Support</h2>

						<address className="mt-2 text-m text-muted-foreground not-italic">support@cashlift.example</address>
					</Panel>
				</li>
			</ul>
		</div>

		<Panel>
			<PanelHeader label="Message" title="Send details" />

			<LeadCaptureForm buttonLabel="Send message" />
		</Panel>
	</MainContent>
);
