import { Shell } from "@/modules/marketing/components/Shell";

export const instant = false;

type LegalRouteLayoutProps = {
	children: React.ReactNode;
};

export default function LegalRouteLayout({ children }: LegalRouteLayoutProps) {
	return <Shell footerVariant="compact">{children}</Shell>;
}
