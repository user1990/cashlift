import { ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/modules/common/money/format";
import { Panel, PanelHeader } from "@/modules/ui/components/Panel";
import { ProgressMeter } from "@/modules/ui/components/ProgressMeter";

type EmergencyFundPanelProps = {
	currentCents: number;
	progress: number;
	sixMonthTargetCents: number;
	threeMonthTargetCents: number;
};

export const EmergencyFundPanel = ({
	currentCents,
	progress,
	sixMonthTargetCents,
	threeMonthTargetCents,
}: EmergencyFundPanelProps) => (
	<Panel>
		<PanelHeader eyebrow="Safety" title="Emergency fund target" />

		<div className="space-y-4">
			<div className="rounded-lg bg-[#FAFAFA] p-4">
				<div className="mb-3 flex items-center gap-2 text-indigo-600">
					<ShieldCheck aria-hidden className="size-5" />

					<span className="text-sm font-semibold text-[#0A0A0A]">
						Six-month runway
					</span>
				</div>

				<p className="font-mono text-3xl font-semibold">
					{formatCurrency(sixMonthTargetCents)}
				</p>

				<p className="mt-1 text-sm text-[#6B6B6B]">
					Three-month floor: {formatCurrency(threeMonthTargetCents)}
				</p>
			</div>

			<ProgressMeter
				label={`${formatCurrency(currentCents)} ready`}
				value={progress}
			/>
		</div>
	</Panel>
);
