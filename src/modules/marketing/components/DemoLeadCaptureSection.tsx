import { Panel, PanelHeader } from "@/ui/components/Panel";
import { LeadCaptureForm } from "./LeadCaptureForm";

export const DemoLeadCaptureSection = () => (
	<Panel className="flex flex-col">
		<PanelHeader label="Book demo" title="Get the audit walkthrough" />

		<LeadCaptureForm
			buttonLabel="Book demo"
			successDescription="We'll follow up with the audit walkthrough. You can explore the sample workspace now."
			successTitle="Demo request received"
		/>
	</Panel>
);
