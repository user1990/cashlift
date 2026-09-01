import type { LucideIcon } from "lucide-react";

export type HomeDecisionStoryAction = {
	description: string;
	impact: string;
	owner: string;
	priority: string;
	title: string;
	type: "approve" | "collect" | "cut";
};

export type UseCaseReferenceDecision = {
	accentClassName: string;
	Icon: LucideIcon;
};
