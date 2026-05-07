import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { AppAuthProvider } from "@/services/clerk/provider";
import messages from "@/services/i18n/messages/en.json";
import { QueryProvider } from "@/services/query/provider";
import "./globals.css";

export const metadata: Metadata = {
	title: "CashLift",
	description: "A cashflow command center for better daily money decisions.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-full">
			<body className="flex min-h-full flex-col antialiased">
				<NextIntlClientProvider locale="en" messages={messages}>
					<AppAuthProvider>
						<QueryProvider>{children}</QueryProvider>
					</AppAuthProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
