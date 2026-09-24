import { MarketingLeadCaptureSection } from "./MarketingLeadCaptureSection";

export const ContactLeadCaptureSection = () => (
	<MarketingLeadCaptureSection
		description="This page does not send or store contact details. Explore the read-only sample workspace or review CashLift's product overview."
		headline="Choose a direct route"
		primaryAction={{ href: "/demo/workspace", label: "Explore live demo" }}
		secondaryAction={{ href: "/features", label: "Review features" }}
	/>
);
