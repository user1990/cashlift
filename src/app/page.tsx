import { mockFinanceRepository } from "@/modules/base/finance/repositories/mock";
import { getCurrentUser } from "@/modules/base/user/api";
import { Dashboard } from "@/modules/features/dashboard/components/Dashboard";

export default async function Home() {
	const user = await getCurrentUser();
	const dataset = await mockFinanceRepository.getDashboardDataset(user.id);

	return <Dashboard dataset={dataset} />;
}
