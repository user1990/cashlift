import { Panel } from "@/modules/ui/components/Panel";

type MetricCardProps = {
	accent?: "indigo";
	icon: React.ReactNode;
	label: string;
	meta: string;
	value: string;
};

export const MetricCard = ({
	accent,
	icon,
	label,
	meta,
	value,
}: MetricCardProps) => (
	<Panel
		className={
			accent === "indigo" ? "border-indigo-200 bg-indigo-50/40" : undefined
		}
	>
		<div className="flex items-start justify-between gap-4">
			<div>
				<p className="text-sm font-medium text-[#6B6B6B]">{label}</p>

				<p className="mt-2 font-mono text-4xl font-semibold tracking-normal text-[#0A0A0A]">
					{value}
				</p>

				<p className="mt-2 max-w-sm text-sm leading-5 text-[#6B6B6B]">{meta}</p>
			</div>

			<div className="rounded-lg border border-[#E8E8EC] bg-white p-2 text-indigo-600">
				{icon}
			</div>
		</div>
	</Panel>
);
