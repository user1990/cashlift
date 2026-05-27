type LegalContentSectionProps = {
	title: string;
};

export const LegalContentSection = ({ title }: LegalContentSectionProps) => (
	<>
		<p className="text-s+ uppercase tracking-normal text-primary">Legal</p>

		<h1 className="mt-4 text-6xl+ tracking-normal text-shell-foreground">{title}</h1>

		<div className="mt-6 space-y-4 text-m leading-7 text-shell-muted">
			<p>
				This MVP page is a placeholder for production legal copy. Kuvro does not move money, issue cards, or provide
				financial, legal, or tax advice in this demo.
			</p>

			<p>Do not enter real credentials, personal financial data, or private company records into the demo workspace.</p>
		</div>
	</>
);
