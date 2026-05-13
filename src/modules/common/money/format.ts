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

const CENTS_IN_DOLLAR = 100;

export const formatCurrency = (cents: MoneyCents) => currencyFormatter.format(cents / CENTS_IN_DOLLAR);

export const formatCurrencyDollars = (dollars: number) => currencyFormatter.format(dollars);

export const formatCompactCurrency = (cents: MoneyCents) => compactCurrencyFormatter.format(cents / CENTS_IN_DOLLAR);

export const centsToDollars = (cents: MoneyCents) => Math.round(cents / CENTS_IN_DOLLAR);

export const percentage = (value: number) => `${Math.round(value)}%`;
