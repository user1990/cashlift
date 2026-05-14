import type { FinancialDataset } from "@/modules/base/finance/types";
import { getInvoiceRiskTotal } from "@/modules/base/finance/utils";
import { formatCurrency, percentage } from "@/modules/common/money/format";
import { AmountListItem } from "@/modules/shared/components/AmountListItem";
import { Panel, PanelHeader } from "@/modules/ui/components/Panel";

type WorkspaceInvoicesSectionProps = {
	dataset: FinancialDataset;
};

const INVOICE_RISK_DATE = new Date("2026-05-09");

export const WorkspaceInvoicesSection = ({ dataset }: WorkspaceInvoicesSectionProps) => (
	<Panel>
		<PanelHeader
			eyebrow="Receivables"
			title={`${formatCurrency(getInvoiceRiskTotal(dataset.invoices, INVOICE_RISK_DATE))} overdue cash risk`}
		/>

		<ul className="grid gap-3 md:grid-cols-2">
			{dataset.invoices.map(({ amountCents, id, status, collectionProbability, owner, client }) => (
				<AmountListItem
					key={id}
					amountCents={amountCents}
					meta={`${status} · ${percentage(collectionProbability)} · ${owner}`}
					title={client}
				/>
			))}
		</ul>
	</Panel>
);
