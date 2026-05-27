import { PROOF_POINTS } from "../content";
import { Hero } from "./Hero";
import { ProofList } from "./ProofList";

export const CustomersEvidenceSection = () => (
	<>
		<Hero
			description="MVP proof stories use demo data until real customer evidence exists. They show the outcomes Kuvro is built to create."
			label="Customers"
			labelAsHeading
			title="Service teams use Kuvro to make money decisions earlier."
		/>

		<ProofList items={PROOF_POINTS} />
	</>
);
