import { ShellContainer } from "@/modules/page-shell/components/ShellContainer";
import { ShellSection } from "@/modules/page-shell/components/ShellSection";
import { PROOF_POINTS } from "../content";
import { ProofList } from "./ProofList";

export const HomeProofSection = () => (
	<ShellSection className="bg-cyan-950">
		<ShellContainer className="py-8 sm:px-6 md:grid-cols-3 lg:px-8">
			<ProofList items={PROOF_POINTS} variant="shell" />
		</ShellContainer>
	</ShellSection>
);
