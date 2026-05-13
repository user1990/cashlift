import { cn } from "@/modules/ui/utils/cn";

type ProgressBarProps = {
	label: string;
	value: number;
	className?: string;
};

export const ProgressBar = ({ className, label, value }: ProgressBarProps) => (
	<div className={cn("space-y-1.5", className)}>
		<div className="flex items-center justify-between gap-3 text-s">
			<span className="font-medium text-panel-foreground">{label}</span>

			<span className="font-mono text-muted-foreground">{Math.round(formatPercent(value))}%</span>
		</div>

		<div
			aria-label={label}
			aria-valuemax={100}
			aria-valuemin={0}
			aria-valuenow={Math.round(formatPercent(value))}
			className="h-2 overflow-hidden rounded-full bg-panel-muted"
			role="progressbar"
		>
			<div
				className="h-full origin-left rounded-full bg-primary transition-transform duration-150 ease-out motion-reduce:transition-none"
				style={{ transform: `scaleX(${formatPercent(value) / 100})` }}
			/>
		</div>
	</div>
);

function formatPercent(value: number) {
	return Math.max(0, Math.min(100, value));
}
