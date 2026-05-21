"use client";

import { CalendarDays, ChevronDown, Download } from "lucide-react";
import { Button } from "@/ui/components/Button";
import type { DashboardViewModel } from "../types";

type OverviewHeaderProps = {
	dashboard: DashboardViewModel;
};

export const OverviewHeader = ({ dashboard }: OverviewHeaderProps) => (
	<header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
		<div>
			<h1 className="text-3xl+ font-semibold tracking-normal text-shell-foreground">
				Good morning, {dashboard.greetingName} <span aria-hidden>👋</span>
			</h1>

			<p className="mt-1 text-m+ text-shell-muted">Here’s your cash and spend overview.</p>
		</div>

		<div className="flex flex-wrap items-center gap-3">
			<Button variant="secondary" className="h-11 border-border bg-shell-elevated px-4 text-shell-foreground">
				<CalendarDays aria-hidden className="size-4" />
				{dashboard.dateRangeLabel}
				<ChevronDown aria-hidden className="size-4" />
			</Button>

			<Button variant="primary" className="h-11 px-4">
				<Download aria-hidden className="size-4" />
				Export report
			</Button>
		</div>
	</header>
);
