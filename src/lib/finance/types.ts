export type MoneyCents = number;

export type Frequency =
	| "weekly"
	| "biweekly"
	| "monthly"
	| "quarterly"
	| "annual";

export type SubscriptionStatus = "active" | "unused" | "trial";

export type DebtType =
	| "credit-card"
	| "student-loan"
	| "auto-loan"
	| "personal-loan";

export type SpendingCategory =
	| "dining"
	| "subscriptions"
	| "transport"
	| "shopping"
	| "fees"
	| "utilities"
	| "wellness";

export type IncomeSource = {
	id: string;
	label: string;
	amountCents: MoneyCents;
	frequency: Frequency;
	nextPayDate: string;
	reliability: "stable" | "variable";
};

export type Bill = {
	id: string;
	label: string;
	amountCents: MoneyCents;
	dueDate: string;
	autopay: boolean;
	category: "housing" | "insurance" | "utilities" | "debt" | "other";
};

export type Subscription = {
	id: string;
	label: string;
	amountCents: MoneyCents;
	dueDate: string;
	status: SubscriptionStatus;
	lastUsedDate?: string;
};

export type Debt = {
	id: string;
	label: string;
	type: DebtType;
	balanceCents: MoneyCents;
	minimumPaymentCents: MoneyCents;
	interestRate: number;
	dueDate: string;
};

export type SavingsGoal = {
	id: string;
	label: string;
	targetCents: MoneyCents;
	currentCents: MoneyCents;
	deadline: string;
	priority: "high" | "medium" | "low";
};

export type TransactionPattern = {
	id: string;
	merchant: string;
	category: SpendingCategory;
	averageAmountCents: MoneyCents;
	monthlyOccurrences: number;
	avoidableScore: number;
};

export type NetWorthSnapshot = {
	id: string;
	weekStart: string;
	assetsCents: MoneyCents;
	liabilitiesCents: MoneyCents;
};

export type IncomeIdea = {
	id: string;
	title: string;
	expectedMonthlyCents: MoneyCents;
	effort: "low" | "medium" | "high";
	nextStep: string;
};

export type MoneyChallenge = {
	id: string;
	title: string;
	impactCents: MoneyCents;
	action: string;
};

export type CashliftProfile = {
	userId: string;
	displayName: string;
	monthlyEssentialExpensesCents: MoneyCents;
	currentEmergencyFundCents: MoneyCents;
};

export type FinancialDataset = {
	profile: CashliftProfile;
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
