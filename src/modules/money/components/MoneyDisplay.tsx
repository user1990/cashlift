import { formatCurrency, formatPreciseCompactCurrency } from "@/modules/money/format";
import type { MoneyCents } from "@/modules/money/types";
import { cn } from "@/ui/utils/cn";

type MoneyDisplayProps = {
	cents: MoneyCents;
	exact?: boolean;
	className?: string;
	warning?: boolean;
};

export const MoneyDisplay = ({ cents, className, exact = false, warning = false }: MoneyDisplayProps) => (
	<span
		className={cn(
			"font-mono font-semibold tabular-nums tracking-normal",
			warning ? "text-warning" : "text-panel-foreground",
			className,
		)}
	>
		{exact ? formatCurrency(cents) : formatPreciseCompactCurrency(cents)}
	</span>
);
