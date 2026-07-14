import { Shell } from "@/modules/marketing/components/Shell";

export const instant = false;

type MarketingRouteLayoutProps = {
	children: React.ReactNode;
};

export default function MarketingRouteLayout({ children }: MarketingRouteLayoutProps) {
	return <Shell>{children}</Shell>;
}
