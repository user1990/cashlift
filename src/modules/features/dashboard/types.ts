import type { DebtPayoffStrategy } from "@/modules/base/finance/types";
import type { buildDashboardViewModel } from "./view-model";

export type DebtStrategy = DebtPayoffStrategy;

export type DashboardViewModel = ReturnType<typeof buildDashboardViewModel>;

export type UpcomingBill = DashboardViewModel["upcomingBills"][number];

export type NetWorthChartDataPoint =
	DashboardViewModel["netWorthChartData"][number];

export type LeakChartDataPoint = DashboardViewModel["leakChartData"][number];

export type SpendingLeak = DashboardViewModel["spendingLeaks"][number];
