"use client";

import { useSyncExternalStore } from "react";
import { AmountItem } from "@/modules/money/components/AmountItem";
import { formatCurrency, percentage } from "@/modules/money/format";
import type { FinancialDataset } from "@/modules/workspace/types";
import { getInvoiceRiskTotal } from "@/modules/workspace/utils";
import { Badge } from "@/ui/components/Badge";
import { Panel, PanelHeader } from "@/ui/components/Panel";

type WorkspaceInvoicesSectionProps = {
	dataset: FinancialDataset;
};

export const WorkspaceInvoicesSection = ({ dataset }: WorkspaceInvoicesSectionProps) => {
	const invoiceRiskTotal = useSyncExternalStore(
		subscribeToBrowserTime,
		() => getInvoiceRiskTotal(dataset.invoices, new Date()),
		getServerInvoiceRiskTotal,
	);

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

			<ul className="grid gap-3 @md:grid-cols-2">
				{dataset.invoices.map(({ amountCents, id, status, collectionProbability, owner, client }) => (
					<AmountItem
						key={id}
						amountCents={amountCents}
						meta={
							<span className="flex flex-wrap items-center gap-1.5">
								<Badge variant={status === "paid" ? "success" : status === "overdue" ? "warning" : "primary"}>
									{status}
								</Badge>

								<span>{percentage(collectionProbability)}</span>

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

function subscribeToBrowserTime() {
	return () => undefined;
}

function getServerInvoiceRiskTotal() {
	return undefined;
}
