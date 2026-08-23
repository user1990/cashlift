import { CalendarClock, Cloud, UsersRound } from "lucide-react";
import type { USE_CASES } from "../content";
import type { UseCaseReferenceDecision } from "../types";
import { UseCaseReferencePage } from "./UseCaseReferencePage";

type SoftwareServicesReferencePageProps = {
	useCase: (typeof USE_CASES)["software-services"];
};

export const SoftwareServicesReferencePage = ({ useCase }: SoftwareServicesReferencePageProps) => (
	<UseCaseReferencePage decisions={SOFTWARE_SERVICES_DECISIONS} useCase={useCase} />
);

const SOFTWARE_SERVICES_DECISIONS = [
	{
		accentClassName: "border-primary-subtle-border bg-primary-subtle text-primary",
		Icon: Cloud,
		title: "Can we add cloud spend for this project?",
	},
	{
		accentClassName: "border-highlight-muted bg-highlight-subtle text-highlight",
		Icon: UsersRound,
		title: "Which subscription seats are idle before renewal?",
	},
	{
		accentClassName: "border-signal bg-signal-subtle text-signal",
		Icon: CalendarClock,
		title: "What happens if a milestone payment slips one week?",
	},
] as const satisfies readonly UseCaseReferenceDecision[];
