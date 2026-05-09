import type { Metadata } from "next";
import { mockFinanceRepository } from "@/modules/base/finance/repositories/mock";
import { getCurrentUser } from "@/modules/base/user/api";
import { Dashboard } from "@/modules/features/dashboard/components/Dashboard";

export const metadata: Metadata = {
	title: "Dashboard — CashLift",
	description:
		"A cashflow command center for better daily money decisions — net worth, leaks, emergency fund, and income ideas.",
};

export default async function Home() {
	const user = await getCurrentUser();
	const dataset = await mockFinanceRepository.getDashboardDataset(user.id);

	return <Dashboard dataset={dataset} />;
}
