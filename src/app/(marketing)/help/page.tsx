import type { Metadata } from "next";
import { Suspense } from "react";
import { HelpPage } from "@/modules/marketing/components/HelpPage";
import { parseHelpFaqQuery } from "@/modules/marketing/utils";

type HelpRouteProps = {
	searchParams: Promise<{
		q?: string | string[];
	}>;
};

export const metadata: Metadata = {
	title: "Help — CashLift",
	description: "Search CashLift answers for the demo, company workspace, plans, and getting started.",
};

export default function Help({ searchParams }: HelpRouteProps) {
	return (
		<Suspense fallback={<HelpPage />}>
			<HelpWithQuery searchParams={searchParams} />
		</Suspense>
	);
}

async function HelpWithQuery({ searchParams }: HelpRouteProps) {
	const { q } = await searchParams;

	return <HelpPage initialQuery={parseHelpFaqQuery(q)} />;
}
