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
						<svg
							aria-hidden="true"
							className="block h-full w-full"
							focusable="false"
							preserveAspectRatio="none"
							viewBox="0 0 100 1"
						>
							<rect
								className="fill-primary"
								data-slot="progress-indicator"
								height="1"
								rx="0.5"
								width={percentage ?? 0}
								x="0"
								y="0"
							/>
						</svg>
					</div>
				</>
			)}
		</RACProgressBar>
	);
};

function formatPercent(value: number) {
	return Math.max(0, Math.min(100, value));
}
