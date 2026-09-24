import { DEMO_PAGE } from "../site";
import { MarketingLeadCaptureSection } from "./MarketingLeadCaptureSection";

export const DemoLeadCaptureSection = () => (
	<MarketingLeadCaptureSection
		description={DEMO_PAGE.description}
		headline="Explore or contact us"
		primaryAction={{ href: "/demo/workspace", label: "Explore live demo" }}
		secondaryAction={{ href: "/contact", label: "Contact CashLift" }}
	/>
);
