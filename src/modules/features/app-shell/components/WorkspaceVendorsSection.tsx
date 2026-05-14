import type { FinancialDataset } from "@/modules/base/finance/types";
import { getVendorLeakSavings } from "@/modules/base/finance/utils";
import { formatCurrency } from "@/modules/common/money/format";
import { SubscriptionLeakList } from "@/modules/shared/components/SubscriptionLeakList";
import { Panel, PanelHeader } from "@/modules/ui/components/Panel";

type WorkspaceVendorsSectionProps = {
	dataset: FinancialDataset;
};

export const WorkspaceVendorsSection = ({ dataset }: WorkspaceVendorsSectionProps) => (
	<Panel>
		<PanelHeader
			eyebrow="Leaks"
			title={`${formatCurrency(getVendorLeakSavings(dataset.subscriptions))} monthly vendor savings`}
		/>

		<SubscriptionLeakList className="grid gap-3 md:grid-cols-2" items={dataset.subscriptions} />
	</Panel>
);
