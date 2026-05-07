import { CashliftDashboard } from "@/components/dashboard/cashlift-dashboard";
import { getCurrentUser } from "@/lib/auth/current-user";
import { mockFinanceRepository } from "@/lib/repositories/mock-finance-repository";

export default async function Home() {
	const user = await getCurrentUser();
	const dataset = await mockFinanceRepository.getDashboardDataset(user.id);

	return <CashliftDashboard dataset={dataset} />;
}
