import { PROOF_POINTS } from "../content";
import { Hero } from "./Hero";
import { ProofList } from "./ProofList";

export const CustomersEvidenceSection = () => (
	<>
		<Hero
			description="See how service teams make money decisions earlier through MVP proof stories built from demo data."
			label="Customers"
			variant="page-title"
		/>

		<ProofList items={PROOF_POINTS} />
	</>
);
