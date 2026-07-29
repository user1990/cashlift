import { Panel } from "@/ui/components/layout/Panel";
import { PanelHeader } from "@/ui/components/layout/PanelHeader";
import { LeadCaptureForm } from "./LeadCaptureForm";

export const ContactLeadCaptureSection = () => (
	<Panel className="flex flex-col">
		<PanelHeader label="Message" title="Send details" />

		<LeadCaptureForm
			buttonLabel="Send message"
			successDescription="We'll follow up with the right next step. You can explore the sample workspace now."
			successTitle="Message received"
		/>
	</Panel>
);
