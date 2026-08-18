import { Hero } from "./Hero";

type LegalContentSectionProps = {
	as?: "h1" | "h2";
};

export const LegalContentSection = ({ as = "h1" }: LegalContentSectionProps) => (
	<section>
		<Hero
			as={as}
			description="Do not enter real credentials, personal financial data, or private company records into the demo workspace."
			label="Legal"
			labelAsHeading
			title="This MVP page is a placeholder for production legal copy. CashLift does not move money, issue cards, or provide financial, legal, or tax advice in this demo."
		/>
	</section>
);
