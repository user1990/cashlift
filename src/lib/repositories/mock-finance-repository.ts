import type { FinancialDataset } from "@/lib/finance/types";
import type { FinanceRepository } from "./finance-repository";

export const mockFinancialDataset: FinancialDataset = {
	bills: [
		{
			amountCents: 210000,
			autopay: true,
			category: "housing",
			dueDate: "2026-05-12",
			id: "bill-rent",
			label: "Apartment rent",
		},
		{
			amountCents: 18400,
			autopay: true,
			category: "utilities",
			dueDate: "2026-05-14",
			id: "bill-power",
			label: "Power and gas",
		},
		{
			amountCents: 12600,
			autopay: false,
			category: "insurance",
			dueDate: "2026-05-16",
			id: "bill-insurance",
			label: "Renters + device insurance",
		},
	],
	dailyChallenges: [
		{
			action:
				"Move the checking buffer above today's safe-to-spend number into emergency savings.",
			id: "challenge-spare-cash",
			impactCents: 1800,
			title: "Sweep spare cash",
		},
		{
			action: "Cancel or pause one service you have not used in 30 days.",
			id: "challenge-cancel",
			impactCents: 1799,
			title: "Remove one unused subscription",
		},
		{
			action:
				"Pack tomorrow's lunch and redirect the avoided spend toward the Japan fund.",
			id: "challenge-lunch",
			impactCents: 1400,
			title: "Save $14 before noon",
		},
	],
	debts: [
		{
			balanceCents: 480000,
			dueDate: "2026-05-18",
			id: "debt-card",
			interestRate: 22.9,
			label: "Rewards card",
			minimumPaymentCents: 12500,
			type: "credit-card",
		},
		{
			balanceCents: 1220000,
			dueDate: "2026-05-22",
			id: "debt-auto",
			interestRate: 6.2,
			label: "Auto loan",
			minimumPaymentCents: 32600,
			type: "auto-loan",
		},
		{
			balanceCents: 760000,
			dueDate: "2026-05-27",
			id: "debt-student",
			interestRate: 4.8,
			label: "Student loan",
			minimumPaymentCents: 16400,
			type: "student-loan",
		},
	],
	incomeIdeas: [
		{
			effort: "low",
			expectedMonthlyCents: 18000,
			id: "idea-overtime",
			nextStep: "Ask manager for one Friday coverage shift this week.",
			title: "Pick up 3 overtime hours",
		},
		{
			effort: "medium",
			expectedMonthlyCents: 24000,
			id: "idea-resale",
			nextStep: "List the unused tablet and two camera lenses by Sunday.",
			title: "Resale cleanup sprint",
		},
		{
			effort: "medium",
			expectedMonthlyCents: 32000,
			id: "idea-client",
			nextStep: "Send the prewritten maintenance offer to three past clients.",
			title: "React support micro-retainer",
		},
	],
	incomeSources: [
		{
			amountCents: 320000,
			frequency: "biweekly",
			id: "income-salary",
			label: "Product salary",
			nextPayDate: "2026-05-15",
			reliability: "stable",
		},
		{
			amountCents: 90000,
			frequency: "monthly",
			id: "income-retainer",
			label: "Weekend client retainer",
			nextPayDate: "2026-05-31",
			reliability: "variable",
		},
	],
	netWorthSnapshots: [
		{
			assetsCents: 3960000,
			id: "nw-1",
			liabilitiesCents: 2590000,
			weekStart: "2026-04-06",
		},
		{
			assetsCents: 4040000,
			id: "nw-2",
			liabilitiesCents: 2520000,
			weekStart: "2026-04-13",
		},
		{
			assetsCents: 4125000,
			id: "nw-3",
			liabilitiesCents: 2465000,
			weekStart: "2026-04-20",
		},
		{
			assetsCents: 4180000,
			id: "nw-4",
			liabilitiesCents: 2392000,
			weekStart: "2026-04-27",
		},
		{
			assetsCents: 4310000,
			id: "nw-5",
			liabilitiesCents: 2320000,
			weekStart: "2026-05-04",
		},
	],
	profile: {
		currentEmergencyFundCents: 920000,
		displayName: "Avery",
		monthlyEssentialExpensesCents: 386000,
		userId: "demo-user",
	},
	savingsGoals: [
		{
			currentCents: 920000,
			deadline: "2026-11-30",
			id: "goal-emergency",
			label: "Emergency fund",
			priority: "high",
			targetCents: 2316000,
		},
		{
			currentCents: 186000,
			deadline: "2026-09-15",
			id: "goal-trip",
			label: "Japan flight fund",
			priority: "medium",
			targetCents: 420000,
		},
		{
			currentCents: 64000,
			deadline: "2026-07-01",
			id: "goal-buffer",
			label: "One-month bill buffer",
			priority: "high",
			targetCents: 386000,
		},
	],
	subscriptions: [
		{
			amountCents: 1799,
			dueDate: "2026-05-09",
			id: "sub-stream",
			label: "StreamPlus",
			lastUsedDate: "2026-03-28",
			status: "unused",
		},
		{
			amountCents: 1199,
			dueDate: "2026-05-11",
			id: "sub-fitness",
			label: "Fitness app",
			lastUsedDate: "2026-05-06",
			status: "active",
		},
		{
			amountCents: 2999,
			dueDate: "2026-05-20",
			id: "sub-design",
			label: "Design suite trial",
			status: "trial",
		},
		{
			amountCents: 1599,
			dueDate: "2026-05-24",
			id: "sub-audio",
			label: "Audio books",
			lastUsedDate: "2026-02-11",
			status: "unused",
		},
	],
	transactionPatterns: [
		{
			avoidableScore: 70,
			averageAmountCents: 1850,
			category: "dining",
			id: "pattern-coffee",
			merchant: "Coffee runs",
			monthlyOccurrences: 14,
		},
		{
			avoidableScore: 85,
			averageAmountCents: 1199,
			category: "fees",
			id: "pattern-atm",
			merchant: "Out-of-network ATM fees",
			monthlyOccurrences: 3,
		},
		{
			avoidableScore: 45,
			averageAmountCents: 4200,
			category: "shopping",
			id: "pattern-marketplace",
			merchant: "Impulse marketplace orders",
			monthlyOccurrences: 4,
		},
		{
			avoidableScore: 55,
			averageAmountCents: 2650,
			category: "transport",
			id: "pattern-rideshare",
			merchant: "Short rideshares",
			monthlyOccurrences: 6,
		},
	],
};

export const mockFinanceRepository: FinanceRepository = {
	async getDashboardDataset() {
		return mockFinancialDataset;
	},
};
