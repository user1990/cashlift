import { MainContent } from "@/modules/page-shell/components/MainContent";

type AuthRouteLayoutProps = {
	children: React.ReactNode;
};

export default function AuthRouteLayout({ children }: AuthRouteLayoutProps) {
	return (
		<MainContent variant="workspace" className="grid place-items-center px-4 py-8 sm:px-6">
			<section aria-label="Authentication">{children}</section>
		</MainContent>
	);
}
