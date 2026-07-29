"use client";

import { AmountItem } from "@/modules/money/components/AmountItem";
import { formatCurrency, getPercentage } from "@/modules/money/format";
import type { FinancialDataset } from "@/modules/workspace/types";
import { Badge } from "@/ui/components/data/Badge";
import { Panel } from "@/ui/components/layout/Panel";
import { PanelHeader } from "@/ui/components/layout/PanelHeader";
import { useInvoiceRiskTotal } from "../hooks/useInvoiceRiskTotal";

type WorkspaceInvoicesSectionProps = {
	dataset: FinancialDataset;
};

export const WorkspaceInvoicesSection = ({ dataset }: WorkspaceInvoicesSectionProps) => {
	const invoiceRiskTotal = useInvoiceRiskTotal(dataset.invoices);

	return (
		<Panel className="@container">
			<PanelHeader
				label="Receivables"
				title={
					invoiceRiskTotal === undefined
						? "Calculating overdue cash risk"
						: `${formatCurrency(invoiceRiskTotal)} overdue cash risk`
				}
			/>

			<ul className="grid @md:grid-cols-2 gap-3">
				{dataset.invoices.map(({ amountCents, id, status, collectionProbability, owner, client }) => (
					<AmountItem
						key={id}
						amountCents={amountCents}
						meta={
							<span className="flex flex-wrap items-center gap-1.5">
								<Badge variant={status === "paid" ? "success" : status === "overdue" ? "warning" : "primary"}>
									{status}
								</Badge>

								<span>{getPercentage(collectionProbability)}</span>

								<span>{owner}</span>
							</span>
						}
						title={client}
					/>
				))}
			</ul>
		</Panel>
	);
};
