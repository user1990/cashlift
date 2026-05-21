type ProofPointProps = {
	metric: string;
	metricClassName: string;
	term: string;
	text: string;
	textClassName: string;
};

export const ProofPoint = ({ metric, metricClassName, term, text, textClassName }: ProofPointProps) => (
	<>
		<dl>
			<dt className="sr-only">{term}</dt>

			<dd className={`font-mono ${metricClassName}`}>{metric}</dd>
		</dl>

		<p className={`text-m leading-6 ${textClassName}`}>{text}</p>
	</>
);
