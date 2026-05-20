import { Panel } from "@/ui/components/Panel";

type MarketingProofListProps = {
	items: readonly {
		metric: string;
		text: string;
	}[];
	variant?: "panel" | "shell";
};

export const MarketingProofList = ({ items, variant = "panel" }: MarketingProofListProps) => (
	<ul className={variant === "panel" ? "mt-10 grid gap-4 md:grid-cols-3" : "contents"}>
		{items.map(({ metric, text }) => (
			<li key={metric}>
				{variant === "panel" ? (
					<Panel as="article">
						<ProofPoint
							metric={metric}
							metricClassName="text-5xl+ text-primary-strong"
							term="Customer proof point"
							text={text}
							textClassName="mt-3 text-muted-foreground"
						/>
					</Panel>
				) : (
					<ProofPoint
						metric={metric}
						metricClassName="text-4xl+ text-primary"
						term="Proof point"
						text={text}
						textClassName="mt-2 text-shell-muted"
					/>
				)}
			</li>
		))}
	</ul>
);

type ProofPointProps = {
	metric: string;
	metricClassName: string;
	term: string;
	text: string;
	textClassName: string;
};

const ProofPoint = ({ metric, metricClassName, term, text, textClassName }: ProofPointProps) => (
	<>
		<dl>
			<dt className="sr-only">{term}</dt>

			<dd className={`font-mono ${metricClassName}`}>{metric}</dd>
		</dl>

		<p className={`text-m leading-6 ${textClassName}`}>{text}</p>
	</>
);
