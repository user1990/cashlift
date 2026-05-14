import { Panel, PanelHeader } from "@/modules/ui/components/Panel";
import { LeadCaptureForm } from "./LeadCaptureForm";

export const ContactPage = () => (
	<main className="mx-auto grid max-w-[1180px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.78fr] lg:px-8 lg:py-20">
		<div>
			<p className="text-s+ uppercase tracking-normal text-primary">Contact</p>

			<h1 className="mt-4 max-w-3xl text-6xl+ tracking-normal text-shell-foreground">
				Talk through cash ops for your service team.
			</h1>

			<p className="mt-5 max-w-2xl text-xl leading-8 text-shell-muted">
				Use this MVP contact page for sales, support, partnerships, and product feedback. Submissions stay local in demo
				mode.
			</p>

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
			<PanelHeader eyebrow="Message" title="Send details" />

			<LeadCaptureForm buttonLabel="Send message" />
		</Panel>
	</main>
);
