import { ShieldCheck } from "lucide-react";
import type { FinancialDataset } from "@/modules/workspace/types";
import { Panel, PanelHeader } from "@/ui/components/Panel";

type WorkspaceSettingsSectionProps = {
	dataset: FinancialDataset;
};

export const WorkspaceSettingsSection = ({ dataset }: WorkspaceSettingsSectionProps) => (
	<div className="grid gap-4 md:grid-cols-2">
		<Panel>
			<PanelHeader label="Company" title={dataset.profile.name} />

			<dl className="space-y-2 text-m text-muted-foreground">
				<div>
					<dt className="inline">Industry: </dt>

					<dd className="inline">{dataset.profile.industry}</dd>
				</div>

				<div>
					<dt className="inline">Default role: </dt>

					<dd className="inline">{dataset.profile.defaultRole}</dd>
				</div>

				<div>
					<dt className="inline">Mock integrations: </dt>

					<dd className="inline">QuickBooks, Xero, bank feed</dd>
				</div>
			</dl>
		</Panel>

		<Panel>
			<PanelHeader label="Safety" title="MVP boundaries" />

			<div className="space-y-2 text-m text-muted-foreground">
				<p>No cards, ACH, bill pay, payroll, or money movement.</p>

				<p>
					<ShieldCheck aria-hidden className="mr-1 inline size-4 text-primary" />
					Repository interfaces keep data boundaries ready for real services.
				</p>
			</div>
		</Panel>
	</div>
);
