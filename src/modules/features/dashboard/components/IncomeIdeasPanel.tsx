import { Lightbulb } from "lucide-react";
import { useMemo } from "react";
import type { FinancialDataset } from "@/modules/base/finance/types";
import { formatCurrency } from "@/modules/common/money/format";
import { Panel, PanelHeader } from "@/modules/ui/components/Panel";

type IncomeIdeasPanelProps = {
	dataset: FinancialDataset;
};

export const IncomeIdeasPanel = ({ dataset }: IncomeIdeasPanelProps) => {
	const totalPotential = useMemo(
		() =>
			dataset.incomeIdeas.reduce(
				(total, idea) => total + idea.expectedMonthlyCents,
				0,
			),
		[dataset.incomeIdeas],
	);

	return (
		<Panel>
			<PanelHeader
				action={
					<span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
						{formatCurrency(totalPotential)}/mo
					</span>
				}
				eyebrow="Income"
				title="Ideas board"
			/>

			<div className="grid gap-3 md:grid-cols-3">
				{dataset.incomeIdeas.map((idea) => (
					<div
						className="rounded-lg border border-[#E8E8EC] bg-[#FAFAFA] p-3"
						key={idea.id}
					>
						<div className="mb-3 flex items-center justify-between gap-3">
							<span className="rounded-md bg-white p-2 text-primary">
								<Lightbulb aria-hidden className="size-4" />
							</span>

							<span className="font-mono text-sm font-semibold">
								{formatCurrency(idea.expectedMonthlyCents)}
							</span>
						</div>

						<p className="text-sm font-semibold">{idea.title}</p>

						<p className="mt-1 text-xs leading-5 text-[#6B6B6B]">
							{idea.nextStep}
						</p>
					</div>
				))}
			</div>
		</Panel>
	);
};
