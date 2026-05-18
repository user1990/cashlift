import type { buildDashboardViewModel } from "./view-model";

export type DashboardViewModel = ReturnType<typeof buildDashboardViewModel>;

export type ForecastChartDataPoint = DashboardViewModel["forecastChartData"][number];

export type SpendChartDataPoint = DashboardViewModel["spendChartData"][number];
