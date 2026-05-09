import type { MoneyCents } from "@/modules/common/money/types";

type SubscriptionStatus = "active" | "unused" | "trial";

type Frequency = "weekly" | "biweekly" | "monthly" | "quarterly" | "annual";

type DebtType = "credit-card" | "student-loan" | "auto-loan" | "personal-loan";

type SpendingCategory =
	| "dining"
	| "subscriptions"
	| "transport"
	| "shopping"
	| "fees"
	| "utilities"
	| "wellness";

type IncomeSource = {
	id: string;
	label: string;
	amountCents: MoneyCents;
	frequency: Frequency;
	nextPayDate: string;
	reliability: "stable" | "variable";
};

type Bill = {
	id: string;
	label: string;
	amountCents: MoneyCents;
	dueDate: string;
	autopayEnabled: boolean;
	category: "housing" | "insurance" | "utilities" | "debt" | "other";
};

type Subscription = {
	id: string;
	label: string;
	amountCents: MoneyCents;
	dueDate: string;
	status: SubscriptionStatus;
	lastUsedDate?: string;
};

type Debt = {
	id: string;
	label: string;
	type: DebtType;
	balanceCents: MoneyCents;
	minimumPaymentCents: MoneyCents;
	interestRate: number;
	dueDate: string;
};

type SavingsGoal = {
	id: string;
	label: string;
	targetCents: MoneyCents;
	currentCents: MoneyCents;
	deadline: string;
	priority: "high" | "medium" | "low";
};

type TransactionPattern = {
	id: string;
	merchant: string;
	category: SpendingCategory;
	averageAmountCents: MoneyCents;
	monthlyOccurrences: number;
	avoidableScore: number;
};

type NetWorthSnapshot = {
	id: string;
	weekStart: string;
	assetsCents: MoneyCents;
	liabilitiesCents: MoneyCents;
};

type IncomeIdea = {
	id: string;
	title: string;
	expectedMonthlyCents: MoneyCents;
	effort: "low" | "medium" | "high";
	nextStep: string;
};

type MoneyChallenge = {
	id: string;
	title: string;
	impactCents: MoneyCents;
	action: string;
};

type CashLiftProfile = {
	userId: string;
	displayName: string;
	monthlyEssentialExpensesCents: MoneyCents;
	currentEmergencyFundCents: MoneyCents;
};

export type FinancialDataset = {
	profile: CashLiftProfile;
	incomeSources: IncomeSource[];
	bills: Bill[];
	subscriptions: Subscription[];
	debts: Debt[];
	savingsGoals: SavingsGoal[];
	transactionPatterns: TransactionPattern[];
	netWorthSnapshots: NetWorthSnapshot[];
	incomeIdeas: IncomeIdea[];
	dailyChallenges: MoneyChallenge[];
};

export type DebtPayoffStrategy = "snowball" | "avalanche";
