"use client";

import type { FinancialDataset } from "@/modules/workspace/types";
import { ActionFind } from "./ActionFind";
import { CatalogFind } from "./CatalogFind";
import { CommandFind } from "./CommandFind";
import type { FindDirectionId } from "./directions";
import { FindFrame } from "./FindFrame";
import { buildFindItems } from "./findModel";

type FindExplorerProps = {
	dataset: FinancialDataset;
	direction: FindDirectionId;
};

export const FindExplorer = ({ dataset, direction }: FindExplorerProps) => {
	const items = buildFindItems(dataset, "/dashboard");

	return (
		<FindFrame direction={direction}>
			{direction === "a" && <CommandFind items={items} />}

			{direction === "b" && <CatalogFind items={items} />}

			{direction === "c" && <ActionFind items={items} />}
		</FindFrame>
	);
};
