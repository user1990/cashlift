import { MainContent } from "@/modules/page-shell/components/MainContent";
import { HomeAuditSection } from "./HomeAuditSection";
import { HomeHeroSection } from "./HomeHeroSection";
import { HomeProductSection } from "./HomeProductSection";
import { HomeProofSection } from "./HomeProofSection";
import { HomeSignalsSection } from "./HomeSignalsSection";
import { HomeWorkflowSection } from "./HomeWorkflowSection";

export const HomePage = () => (
	<MainContent variant="plain">
		<HomeHeroSection />

		<HomeProofSection />

		<HomeSignalsSection />

		<HomeProductSection />

		<HomeWorkflowSection />

		<HomeAuditSection />
	</MainContent>
);
