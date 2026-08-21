import type { Metadata } from "next";
import { HelpPage } from "@/modules/marketing/components/HelpPage";
import { parseHelpFaqQuery } from "@/modules/marketing/utils";

type HelpRouteProps = {
	searchParams: Promise<{
		q?: string | string[];
	}>;
};

export const metadata: Metadata = {
	title: "Help — CashLift",
	description: "Find answers about the CashLift demo, company workspace, cash actions, plans, and getting started.",
};

export default async function Help({ searchParams }: HelpRouteProps) {
	const { q } = await searchParams;

	return <HelpPage query={parseHelpFaqQuery(q)} />;
}
