import { MainContent } from "@/modules/page-shell/components/MainContent";
import { PROOF_POINTS } from "../content";
import { MarketingHero } from "./MarketingHero";
import { MarketingProofList } from "./MarketingProofList";

export const CustomersPage = () => (
	<MainContent variant="marketing">
		<MarketingHero
			description="MVP proof stories use demo data until real customer evidence exists. They show the outcomes CashLift is built to create."
			label="Customers"
			title="Service teams use CashLift to make money decisions earlier."
		/>

		<MarketingProofList items={PROOF_POINTS} />
	</MainContent>
);
