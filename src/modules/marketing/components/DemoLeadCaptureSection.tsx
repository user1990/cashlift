import { Panel, PanelHeader } from "@/ui/components/Panel";
import { LeadCaptureForm } from "./LeadCaptureForm";

export const DemoLeadCaptureSection = () => (
	<Panel className="flex flex-col">
		<PanelHeader label="Book walkthrough" title="Choose who we should contact" />

		<LeadCaptureForm
			buttonLabel="Book an audit walkthrough"
			successDescription="We'll follow up to arrange the audit walkthrough. You can explore the read-only workspace now."
			successTitle="Walkthrough request received"
		/>
	</Panel>
);
