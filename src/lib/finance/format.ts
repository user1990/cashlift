import type { MoneyCents } from "./types";

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
	currency: "USD",
	maximumFractionDigits: 0,
	notation: "compact",
	style: "currency",
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
	currency: "USD",
	maximumFractionDigits: 0,
	style: "currency",
});

export function formatCurrency(cents: MoneyCents) {
	return currencyFormatter.format(cents / 100);
}

export function formatCompactCurrency(cents: MoneyCents) {
	return compactCurrencyFormatter.format(cents / 100);
}

export function centsToDollars(cents: MoneyCents) {
	return Math.round(cents / 100);
}

export function percentage(value: number) {
	return `${Math.round(value)}%`;
}
