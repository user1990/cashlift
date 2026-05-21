import { AmountItem } from "@/modules/money/components/AmountItem";
import { formatCurrency, percentage } from "@/modules/money/format";
import type { FinancialDataset } from "@/modules/workspace/types";
import { getInvoiceRiskTotal } from "@/modules/workspace/utils";
import { Panel, PanelHeader } from "@/ui/components/Panel";

type WorkspaceInvoicesSectionProps = {
	dataset: FinancialDataset;
};

const INVOICE_RISK_DATE = new Date("2026-05-09");

export const WorkspaceInvoicesSection = ({ dataset }: WorkspaceInvoicesSectionProps) => (
	<Panel className="@container">
		<PanelHeader
			label="Receivables"
			title={`${formatCurrency(getInvoiceRiskTotal(dataset.invoices, INVOICE_RISK_DATE))} overdue cash risk`}
		/>

		<ul className="grid gap-3 @md:grid-cols-2">
			{dataset.invoices.map(({ amountCents, id, status, collectionProbability, owner, client }) => (
				<AmountItem
					key={id}
					amountCents={amountCents}
					meta={`${status} · ${percentage(collectionProbability)} · ${owner}`}
					title={client}
				/>
			))}
		</ul>
	</Panel>
);
