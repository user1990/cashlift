import { MainContent } from "@/modules/page-shell/components/MainContent";
import { DemoLeadCaptureSection } from "./DemoLeadCaptureSection";
import { DemoOverviewSection } from "./DemoOverviewSection";

export const DemoPage = () => (
	<MainContent variant="marketing" className="grid gap-8 lg:grid-cols-[1fr_0.78fr]">
		<DemoOverviewSection />

		<DemoLeadCaptureSection />
	</MainContent>
);
