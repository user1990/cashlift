"use client";

import { NextIntlClientProvider } from "next-intl";
import { AuthProvider } from "@/services/clerk/provider";
import messages from "@/services/i18n/messages/en.json";
import { QueryProvider } from "@/services/query/provider";
import { ScrollToTopButton } from "../../ScrollToTopButton";

type WorkspaceProvidersProps = {
	children: React.ReactNode;
};

export const WorkspaceProviders = ({ children }: WorkspaceProvidersProps) => (
	<AuthProvider>
		<NextIntlClientProvider locale="en" messages={messages}>
			<QueryProvider>
				{children}

				<ScrollToTopButton />
			</QueryProvider>
		</NextIntlClientProvider>
	</AuthProvider>
);
