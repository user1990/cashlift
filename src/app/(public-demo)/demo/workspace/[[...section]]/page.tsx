import { notFound } from "next/navigation";
import { WorkspacePageContent } from "@/modules/page-shell/components/WorkspacePageContent";
import { DEMO_WORKSPACE_DATASET } from "@/modules/workspace/demoDataset";
import { reduceDatasetForScope } from "@/modules/workspace/read-models";
import { WORKSPACE_DATASET_SCOPE_SCHEMA } from "@/modules/workspace/schemas";
import type { WorkspaceDatasetScope } from "@/modules/workspace/types";

const DEMO_SECTIONS = ["cash", "invoices", "vendors", "budgets", "approvals", "team", "settings"] as const;

type DemoWorkspacePageProps = {
	params: Promise<{ section?: string[] }>;
};

export function generateStaticParams() {
	return [{ section: [] }, ...DEMO_SECTIONS.map((section) => ({ section: [section] }))];
}

export default async function DemoWorkspacePage({ params }: DemoWorkspacePageProps) {
	const { section: sectionSegments } = await params;
	const section = resolveDemoSection(sectionSegments);

	if (!section) {
		notFound();
	}

	return (
		<WorkspacePageContent
			dataset={reduceDatasetForScope(DEMO_WORKSPACE_DATASET, section)}
			experience="public-demo"
			section={section}
		/>
	);
}

function resolveDemoSection(sectionSegments?: string[]): WorkspaceDatasetScope | undefined {
	if (!sectionSegments?.length) {
		return "overview";
	}

	if (sectionSegments.length !== 1) {
		return undefined;
	}

	const result = WORKSPACE_DATASET_SCOPE_SCHEMA.safeParse(sectionSegments[0]);

	return result.success && result.data !== "overview" ? result.data : undefined;
}
