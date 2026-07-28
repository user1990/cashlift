import type { MoneyCents } from "./types";

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
	currency: "USD",
	maximumFractionDigits: 0,
	style: "currency",
});

const CENTS_IN_DOLLAR = 100;
const COMPACT_CURRENCY_UNITS = [
	{ suffix: "T", value: 1_000_000_000_000 },
	{ suffix: "B", value: 1_000_000_000 },
	{ suffix: "M", value: 1_000_000 },
	{ suffix: "K", value: 1_000 },
] as const;

export const formatCurrency = (cents: MoneyCents) => CURRENCY_FORMATTER.format(Math.abs(cents) / CENTS_IN_DOLLAR);

export const formatCurrencyDollars = (dollars: number) => CURRENCY_FORMATTER.format(dollars);

export const formatPreciseCompactCurrency = (cents: MoneyCents) => {
	const dollars = cents / CENTS_IN_DOLLAR;
	const absoluteDollars = Math.abs(dollars);
	const unit = COMPACT_CURRENCY_UNITS.find(({ value }) => absoluteDollars >= value);

	if (!unit) {
		return CURRENCY_FORMATTER.format(dollars);
	}

	const compactValue = trimTrailingZeros(absoluteDollars / unit.value);
	const prefix = dollars < 0 ? "-$" : "$";

	return `${prefix}${compactValue}${unit.suffix}`;
};

export const centsToDollars = (cents: MoneyCents) => Math.round(cents / CENTS_IN_DOLLAR);

export const getPercentage = (value: number) => `${Math.round(value)}%`;

function trimTrailingZeros(value: number) {
	return value.toFixed(2).replace(/\.?0+$/, "");
}
