import { formatCurrency } from "@/modules/money/format";
import { LeakList } from "@/modules/subscriptions/components/LeakList";
import type { FinancialDataset } from "@/modules/workspace/types";
import { getVendorLeakSavings } from "@/modules/workspace/utils";
import { Panel, PanelHeader } from "@/ui/components/Panel";

type WorkspaceVendorsSectionProps = {
	dataset: FinancialDataset;
};

export const WorkspaceVendorsSection = ({ dataset }: WorkspaceVendorsSectionProps) => (
	<Panel className="@container">
		<PanelHeader
			label="Leaks"
			title={`${formatCurrency(getVendorLeakSavings(dataset.subscriptions))} monthly vendor savings`}
		/>

		<LeakList items={dataset.subscriptions} className="grid gap-3 @md:grid-cols-2" />
	</Panel>
);
