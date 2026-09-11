import type { Metadata } from "next";
import { headers } from "next/headers";
import type { CashActionType } from "@/modules/cash-actions/types";
import { HomePage } from "@/modules/marketing/components/HomePage";
import { SITE_META } from "@/modules/marketing/site";
import type { HomeDecisionStoryAction } from "@/modules/marketing/types";
import { formatCurrency } from "@/modules/money/format";
import { DEMO_WORKSPACE_DATASET } from "@/modules/workspace/demoDataset";
import { SITE_URL } from "@/services/site";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
	title: SITE_META.homeTitle,
	description: SITE_META.homeDescription,
};

const HOME_STRUCTURED_DATA = {
	"@context": "https://schema.org",
	"@type": "SoftwareApplication",
	applicationCategory: "BusinessApplication",
	description: SITE_META.structuredDataDescription,
	name: "CashLift",
	operatingSystem: "Web",
	url: SITE_URL,
} as const;

const ORGANIZATION_STRUCTURED_DATA = {
	"@context": "https://schema.org",
	"@type": "Organization",
	contactPoint: {
		"@type": "ContactPoint",
		contactType: "sales and support",
		url: `${SITE_URL}/contact`,
	},
	description: SITE_META.structuredDataDescription,
	logo: `${SITE_URL}/brand/cashlift-icon.svg`,
	name: "CashLift",
	url: SITE_URL,
} as const;

export default async function Home() {
	const nonce = (await headers()).get("x-nonce") ?? undefined;

	return (
		<>
			<HomePage actions={HOME_DECISION_ACTIONS} />

			<script nonce={nonce} type="application/ld+json">
				{JSON.stringify(HOME_STRUCTURED_DATA)}
			</script>

			<script nonce={nonce} type="application/ld+json">
				{JSON.stringify(ORGANIZATION_STRUCTURED_DATA)}
			</script>
		</>
	);
}

const HOME_DECISION_ACTIONS = [
	getHomeDecisionAction("collection", "collect"),
	getHomeDecisionAction("approval", "approve"),
	getHomeDecisionAction("vendor-leak", "cut"),
] satisfies HomeDecisionStoryAction[];

function getHomeDecisionAction(
	actionType: Extract<CashActionType, "approval" | "collection" | "vendor-leak">,
	storyType: HomeDecisionStoryAction["type"],
): HomeDecisionStoryAction {
	const action = DEMO_WORKSPACE_DATASET.cashActions.find(({ type }) => type === actionType);

	if (!action) {
		throw new Error(`Missing demo cash action for ${actionType}`);
	}

	return {
		description: action.description,
		impact: formatCurrency(action.impactCents),
		owner: action.owner,
		priority: action.priority,
		title: action.title,
		type: storyType,
	} satisfies HomeDecisionStoryAction;
}
