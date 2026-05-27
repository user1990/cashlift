import { Panel, PanelHeader } from "@/ui/components/Panel";
import { LeadCaptureForm } from "./LeadCaptureForm";

export const DemoLeadCaptureSection = () => (
	<Panel className="flex flex-col">
		<PanelHeader label="Book demo" title="Get the audit walkthrough" />

		<LeadCaptureForm buttonLabel="Book demo" />
	</Panel>
);
