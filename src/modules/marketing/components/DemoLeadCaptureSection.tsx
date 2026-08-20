import { Panel } from "@/ui/components/layout/Panel";
import { cn } from "@/ui/utils/cn";
import { LeadCaptureForm } from "./LeadCaptureForm";

export const DemoLeadCaptureSection = () => (
	<Panel as="section" variant="glass" className={getDemoLeadCapturePanelClassName()}>
		<header className="mb-5">
			<p className="text-primary text-s+ uppercase tracking-normal">Book walkthrough</p>

			<h2 className="mt-2 text-l+ text-shell-foreground">Choose who we should contact</h2>
		</header>

		<LeadCaptureForm
			buttonLabel="Book an audit walkthrough"
			successDescription="We'll follow up to arrange the audit walkthrough. You can explore the read-only workspace now."
			successTitle="Walkthrough request received"
		/>
	</Panel>
);

function getDemoLeadCapturePanelClassName() {
	return cn(
		"flex flex-col bg-shell-elevated/45 p-5 shadow-none backdrop-blur-sm max-md:bg-shell-elevated/90 max-md:backdrop-blur-none md:p-6 lg:self-start",
		"[&_[data-slot=field-label]]:text-shell-foreground",
		"[&_[data-slot=input]]:border-shell-border [&_[data-slot=input]]:bg-shell/40 [&_[data-slot=input]]:text-shell-foreground",
		"[&_[data-slot=combobox-input]]:border-shell-border [&_[data-slot=combobox-input]]:bg-shell/40 [&_[data-slot=combobox-input]]:text-shell-foreground",
		"[&_[data-slot=combobox-list]]:border-shell-border [&_[data-slot=combobox-list]]:bg-shell-elevated/95",
	);
}
