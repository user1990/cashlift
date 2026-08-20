"use client";

import type { FinancialDataset } from "@/modules/workspace/types";
import { DashboardCockpit } from "./DashboardCockpit";

type ExplorePrototypeProps = {
	dataset: FinancialDataset;
};

/** @deprecated Use DashboardCockpit via production Overview instead. */
export const ExplorePrototype = ({ dataset }: ExplorePrototypeProps) => <DashboardCockpit dataset={dataset} />;
