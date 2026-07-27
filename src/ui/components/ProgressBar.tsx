"use client";

import { ProgressBar as RACProgressBar } from "react-aria-components";
import { cn } from "@/ui/utils/cn";

type ProgressBarProps = {
	label: string;
	value: number;
	className?: string;
};

export const ProgressBar = ({ label, value, className }: ProgressBarProps) => {
	const normalizedValue = formatPercent(value);

	return (
		<RACProgressBar
			aria-label={label}
			className={cn("space-y-1.5", className)}
			maxValue={100}
			minValue={0}
			value={normalizedValue}
		>
			{({ percentage }) => (
				<>
					<div className="flex items-center justify-between gap-3 text-s">
						<span className="font-medium text-panel-foreground">{label}</span>

						<span className="font-mono text-muted-foreground">{Math.round(normalizedValue)}%</span>
					</div>

					<div className="h-2 w-full overflow-hidden rounded-full bg-panel-muted" data-slot="progress-track">
						<div
							className="h-full rounded-full bg-primary"
							data-slot="progress-indicator"
							style={{ width: `${percentage ?? 0}%` }}
						/>
					</div>
				</>
			)}
		</RACProgressBar>
	);
};

function formatPercent(value: number) {
	return Math.max(0, Math.min(100, value));
}
