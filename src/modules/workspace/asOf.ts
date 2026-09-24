import type { FinancialDataset } from "./types";

export const parseWorkspaceIsoDate = (isoDate: string) => new Date(`${isoDate}T00:00:00`);

export const getWorkspaceAsOfFromForecast = (dataset: FinancialDataset) => {
	const isoDate = dataset.forecast[0]?.date;

	return isoDate ? parseWorkspaceIsoDate(isoDate) : undefined;
};
