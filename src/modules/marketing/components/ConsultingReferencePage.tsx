import { BellRing, Plane, UsersRound } from "lucide-react";
import type { USE_CASES } from "../content";
import type { UseCaseReferenceDecision } from "../types";
import { UseCaseReferencePage } from "./UseCaseReferencePage";

type ConsultingReferencePageProps = {
	useCase: (typeof USE_CASES)["consulting"];
};

export const ConsultingReferencePage = ({ useCase }: ConsultingReferencePageProps) => (
	<UseCaseReferencePage cardHref="/demo" decisions={CONSULTING_DECISIONS} showSignalRail useCase={useCase} />
);

const CONSULTING_DECISIONS = [
	{
		accentClassName: "border-primary-subtle-border bg-primary-subtle text-primary",
		Icon: Plane,
	},
	{
		accentClassName: "border-highlight-muted bg-highlight-subtle text-highlight",
		Icon: BellRing,
	},
	{
		accentClassName: "border-primary-subtle-border bg-primary-subtle text-primary",
		Icon: UsersRound,
	},
] as const satisfies readonly UseCaseReferenceDecision[];
