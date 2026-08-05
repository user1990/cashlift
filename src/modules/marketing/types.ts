export type HomeDecisionStoryAction = {
	description: string;
	impact: string;
	owner: string;
	priority: string;
	title: string;
	type: "approve" | "collect" | "cut";
};
