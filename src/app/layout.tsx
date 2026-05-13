import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { MotionProvider } from "@/modules/ui/components/MotionProvider";
import { AuthProvider } from "@/services/clerk/provider";
import messages from "@/services/i18n/messages/en.json";
import { QueryProvider } from "@/services/query/provider";
import "./globals.css";

export const metadata: Metadata = {
	title: "CashLift",
	description: "A cash-aware spend decision command center for service firms.",
};

type RootLayoutProps = Readonly<{
	children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en" className="h-full">
			<body className="flex min-h-full flex-col antialiased">
				<NextIntlClientProvider locale="en" messages={messages}>
					<AuthProvider>
						<QueryProvider>
							<MotionProvider>{children}</MotionProvider>
						</QueryProvider>
					</AuthProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
