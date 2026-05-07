import type { DebtStrategy } from "./types";

export const debtStrategyOptions: Array<{
	label: string;
	value: DebtStrategy;
}> = [
	{ label: "Avalanche", value: "avalanche" },
	{ label: "Snowball", value: "snowball" },
];
