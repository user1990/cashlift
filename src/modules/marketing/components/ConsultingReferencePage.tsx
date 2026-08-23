import { BellRing, Plane, UsersRound } from "lucide-react";
import type { USE_CASES } from "../content";
import type { UseCaseReferenceDecision } from "../types";
import { UseCaseReferencePage } from "./UseCaseReferencePage";

type ConsultingReferencePageProps = {
	useCase: (typeof USE_CASES)["consulting"];
};

export const ConsultingReferencePage = ({ useCase }: ConsultingReferencePageProps) => (
	<UseCaseReferencePage
		cardHref="/demo"
		decisions={CONSULTING_DECISIONS}
		gridColumnsClassName="md:grid-cols-3"
		showSignalRail
		useCase={useCase}
	/>
);

const CONSULTING_DECISIONS = [
	{
		accentClassName: "border-primary-subtle-border bg-primary-subtle text-primary",
		Icon: Plane,
		title: "Can we book travel for the workshop without dipping under buffer?",
	},
	{
		accentClassName: "border-highlight-muted bg-highlight-subtle text-highlight",
		Icon: BellRing,
		title: "Which retainer needs a collection nudge today?",
	},
	{
		accentClassName: "border-primary-subtle-border bg-primary-subtle text-primary",
		Icon: UsersRound,
		title: "Which team has budget room for a contractor?",
	},
] as const satisfies readonly UseCaseReferenceDecision[];
