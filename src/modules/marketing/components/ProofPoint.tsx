import type { LucideIcon } from "lucide-react";

type ProofPointProps = {
	Icon?: LucideIcon;
	metric: string;
	metricClassName: string;
	term: string;
	text: string;
	textClassName: string;
};

export const ProofPoint = ({ Icon, metric, metricClassName, term, text, textClassName }: ProofPointProps) => (
	<>
		<dl>
			<dt className="sr-only">{term}</dt>

			<dd className={`font-mono ${metricClassName}`}>{metric}</dd>
		</dl>

		{Icon && (
			<span
				aria-hidden
				className="flex size-10 shrink-0 items-center justify-center rounded-md border border-shell-border bg-shell/40 text-primary"
			>
				<Icon aria-hidden strokeWidth={1.5} className="size-5" />
			</span>
		)}

		<p className={`text-m leading-6 ${textClassName}`}>{text}</p>
	</>
);
