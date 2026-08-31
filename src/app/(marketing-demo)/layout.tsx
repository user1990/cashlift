import { Shell } from "@/modules/marketing/components/Shell";

export const instant = false;

type MarketingDemoRouteLayoutProps = {
	children: React.ReactNode;
};

export default function MarketingDemoRouteLayout({ children }: MarketingDemoRouteLayoutProps) {
	return <Shell footerVariant="compact">{children}</Shell>;
}
