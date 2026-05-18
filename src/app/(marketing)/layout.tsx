import { MarketingLayout } from "@/modules/marketing/components/MarketingLayout";

type MarketingRouteLayoutProps = {
	children: React.ReactNode;
};

export default function MarketingRouteLayout({ children }: MarketingRouteLayoutProps) {
	return <MarketingLayout>{children}</MarketingLayout>;
}
