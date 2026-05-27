import { MainContent } from "@/modules/page-shell/components/MainContent";
import { ContactLeadCaptureSection } from "./ContactLeadCaptureSection";
import { ContactOverviewSection } from "./ContactOverviewSection";

export const ContactPage = () => (
	<MainContent variant="marketing" className="grid gap-8 lg:grid-cols-[1fr_0.78fr]">
		<ContactOverviewSection />

		<ContactLeadCaptureSection />
	</MainContent>
);
