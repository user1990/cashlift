import type { MoneyCents } from "@/lib/finance/types";

export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json }
	| Json[];

export type CashliftDatabase = {
	public: {
		Tables: {
			bills: {
				Insert: {
					amount_cents: MoneyCents;
					category: string;
					due_date: string;
					label: string;
					user_id: string;
				};
				Row: {
					amount_cents: MoneyCents;
					autopay: boolean;
					category: string;
					due_date: string;
					id: string;
					label: string;
					user_id: string;
				};
				Update: Partial<
					CashliftDatabase["public"]["Tables"]["bills"]["Insert"]
				>;
			};
			debts: {
				Insert: {
					balance_cents: MoneyCents;
					due_date: string;
					interest_rate: number;
					label: string;
					minimum_payment_cents: MoneyCents;
					type: string;
					user_id: string;
				};
				Row: {
					balance_cents: MoneyCents;
					due_date: string;
					id: string;
					interest_rate: number;
					label: string;
					minimum_payment_cents: MoneyCents;
					type: string;
					user_id: string;
				};
				Update: Partial<
					CashliftDatabase["public"]["Tables"]["debts"]["Insert"]
				>;
			};
			financial_events: {
				Insert: {
					amount_cents: MoneyCents;
					kind: string;
					label: string;
					metadata?: Json;
					user_id: string;
				};
				Row: {
					amount_cents: MoneyCents;
					created_at: string;
					id: string;
					kind: string;
					label: string;
					metadata: Json;
					user_id: string;
				};
				Update: Partial<
					CashliftDatabase["public"]["Tables"]["financial_events"]["Insert"]
				>;
			};
			savings_goals: {
				Insert: {
					current_cents: MoneyCents;
					deadline: string;
					label: string;
					priority: string;
					target_cents: MoneyCents;
					user_id: string;
				};
				Row: {
					current_cents: MoneyCents;
					deadline: string;
					id: string;
					label: string;
					priority: string;
					target_cents: MoneyCents;
					user_id: string;
				};
				Update: Partial<
					CashliftDatabase["public"]["Tables"]["savings_goals"]["Insert"]
				>;
			};
		};
	};
};
