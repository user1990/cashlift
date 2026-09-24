import { MainContent } from "@/ui/components/layout/MainContent";
import { DemoLeadCaptureSection } from "./DemoLeadCaptureSection";
import { DemoOverviewSection } from "./DemoOverviewSection";

export const DemoPage = () => (
	<MainContent variant="marketing" className="grid gap-8 lg:grid-cols-[1fr_0.78fr]">
		<DemoOverviewSection />

		<DemoLeadCaptureSection />
	</MainContent>
);
