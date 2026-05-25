import { MainContent } from "@/modules/page-shell/components/MainContent";
import { ScrollToTopButton } from "@/modules/page-shell/components/ScrollToTopButton";
import { ShellContainer } from "@/modules/page-shell/components/ShellContainer";
import { ShellSection } from "@/modules/page-shell/components/ShellSection";
import { PROOF_POINTS } from "../content";
import { HomeAuditSection } from "./HomeAuditSection";
import { HomeHeroSection } from "./HomeHeroSection";
import { HomeProductSection } from "./HomeProductSection";
import { HomeSignalsSection } from "./HomeSignalsSection";
import { HomeWorkflowSection } from "./HomeWorkflowSection";
import { ProofList } from "./ProofList";

export const HomePage = () => (
	<MainContent variant="plain">
		<HomeHeroSection />

		<ShellSection className="bg-cyan-950">
			<ShellContainer className="py-8 sm:px-6 md:grid-cols-3 lg:px-8">
				<ProofList items={PROOF_POINTS} variant="shell" />
			</ShellContainer>
		</ShellSection>

		<HomeSignalsSection />

		<HomeProductSection />

		<HomeWorkflowSection />

		<HomeAuditSection />

		<ScrollToTopButton />
	</MainContent>
);
