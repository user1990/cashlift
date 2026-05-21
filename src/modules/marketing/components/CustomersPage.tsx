import { MainContent } from "@/modules/page-shell/components/MainContent";
import { PROOF_POINTS } from "../content";
import { Hero } from "./Hero";
import { ProofList } from "./ProofList";

export const CustomersPage = () => (
	<MainContent variant="marketing">
		<Hero
			description="MVP proof stories use demo data until real customer evidence exists. They show the outcomes CashLift is built to create."
			label="Customers"
			title="Service teams use CashLift to make money decisions earlier."
		/>

		<ProofList items={PROOF_POINTS} />
	</MainContent>
);
