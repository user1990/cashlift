import { Shell } from "@/modules/marketing/components/Shell";

type MarketingRouteLayoutProps = {
	children: React.ReactNode;
};

export default function MarketingRouteLayout({ children }: MarketingRouteLayoutProps) {
	return <Shell>{children}</Shell>;
}
