"use client";

import dynamic from "next/dynamic";
import { NextIntlClientProvider } from "next-intl";
import { type ReactNode, Suspense } from "react";
import messages from "@/services/i18n/messages/en.json";
import { QueryProvider } from "@/services/query/provider";

const AuthProvider = dynamic(() => import("@/services/clerk/provider").then((module) => module.AuthProvider));

type WorkspaceProvidersProps = {
	authEnabled?: boolean;
	authFallback?: ReactNode;
	children: ReactNode;
};

export const WorkspaceProviders = ({ authEnabled = true, authFallback, children }: WorkspaceProvidersProps) => {
	const content = authEnabled ? (
		<Suspense fallback={authFallback}>
			<AuthProvider>{children}</AuthProvider>
		</Suspense>
	) : (
		children
	);

	return (
		<NextIntlClientProvider locale="en" messages={messages}>
			<QueryProvider>{content}</QueryProvider>
		</NextIntlClientProvider>
	);
};
