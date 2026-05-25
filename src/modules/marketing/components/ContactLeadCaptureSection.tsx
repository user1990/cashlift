import { Panel, PanelHeader } from "@/ui/components/Panel";
import { LeadCaptureForm } from "./LeadCaptureForm";

export const ContactLeadCaptureSection = () => (
	<Panel className="flex flex-col">
		<PanelHeader label="Message" title="Send details" />

		<LeadCaptureForm buttonLabel="Send message" />
	</Panel>
);
