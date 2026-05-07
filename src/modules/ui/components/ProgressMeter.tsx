import { cn } from "@/modules/ui/utils/cn";

type ProgressMeterProps = {
	label: string;
	value: number;
	className?: string;
};

export const ProgressMeter = ({
	className,
	label,
	value,
}: ProgressMeterProps) => {
	const boundedValue = Math.max(0, Math.min(100, value));

	return (
		<div className={cn("space-y-1.5", className)}>
			<div className="flex items-center justify-between gap-3 text-xs">
				<span className="font-medium text-[#0A0A0A]">{label}</span>
				<span className="font-mono text-[#6B6B6B]">
					{Math.round(boundedValue)}%
				</span>
			</div>
			<div
				aria-label={label}
				aria-valuemax={100}
				aria-valuemin={0}
				aria-valuenow={Math.round(boundedValue)}
				className="h-2 overflow-hidden rounded-full bg-[#F0F0F2]"
				role="progressbar"
			>
				<div
					className="h-full rounded-full bg-indigo-600 transition-[width] duration-300 ease-out motion-reduce:transition-none"
					style={{ width: `${boundedValue}%` }}
				/>
			</div>
		</div>
	);
};
