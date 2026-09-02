"use client";

import type { ReactNode } from "react";
import type { FinancialDataset } from "@/modules/workspace/types";
import { buildFindItems, hasActiveFindFilters } from "./find/findModel";
import { useFindSession } from "./find/useFindSession";
import { WorkspaceFindCommandPalette } from "./find/WorkspaceFindCommandPalette";
import { WorkspaceFindResults } from "./find/WorkspaceFindResults";
import { WorkspaceFindTrigger } from "./find/WorkspaceFindTrigger";
import { GlassCard } from "./GlassCard";

type WorkspaceFindShellProps = {
	basePath: string;
	children: ReactNode;
	dataset: FinancialDataset;
};

export const WorkspaceFindShell = ({ basePath, children, dataset }: WorkspaceFindShellProps) => {
	const items = buildFindItems(dataset, basePath);
	const session = useFindSession(items, "work");
	const findActive =
		Boolean(session.query.query) || hasActiveFindFilters(session.query) || session.query.category !== "all";

	return (
		<div className="space-y-6">
			<WorkspaceFindTrigger onOpen={session.openPalette} />

			<WorkspaceFindCommandPalette items={items} session={session} />

			{findActive && !session.open ? (
				<GlassCard atmosphere="find">
					<WorkspaceFindResults itemsCount={items.length} session={session} />
				</GlassCard>
			) : (
				children
			)}
		</div>
	);
};
