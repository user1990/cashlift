import { MainContent } from "@/modules/page-shell/components/MainContent";

type LegalPageProps = {
	title: string;
};

export const LegalPage = ({ title }: LegalPageProps) => (
	<MainContent variant="marketing" className="max-w-[820px]">
		<p className="text-s+ uppercase tracking-normal text-primary">Legal</p>

		<h1 className="mt-4 text-6xl+ tracking-normal text-shell-foreground">{title}</h1>

		<div className="mt-6 space-y-4 text-m leading-7 text-shell-muted">
			<p>
				This MVP page is a placeholder for production legal copy. CashLift does not move money, issue cards, or provide
				financial, legal, or tax advice in this demo.
			</p>

			<p>Do not enter real credentials, personal financial data, or private company records into the demo workspace.</p>
		</div>
	</MainContent>
);
