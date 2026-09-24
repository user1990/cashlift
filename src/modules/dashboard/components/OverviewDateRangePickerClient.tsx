"use client";

import { parseDate } from "@internationalized/date";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import {
	Button as AriaButton,
	CalendarCell,
	CalendarGrid,
	DateRangePicker,
	Dialog,
	Heading,
	Label,
	Popover,
	RangeCalendar,
} from "react-aria-components";
import type { WorkspaceDatasetDateRange } from "@/modules/workspace/types";
import { cn } from "@/ui/utils/cn";
import { getOverviewDateRangeLabel } from "../overviewDateRangeLabel";

type OverviewDateRangePickerClientProps = {
	fallbackLabel: string;
	dateRange?: WorkspaceDatasetDateRange;
	onDateRangeChange?: (dateRange: WorkspaceDatasetDateRange) => void;
};

export const OverviewDateRangePickerClient = ({
	dateRange,
	fallbackLabel,
	onDateRangeChange,
}: OverviewDateRangePickerClientProps) => {
	const value = dateRange ? { end: parseDate(dateRange.endDate), start: parseDate(dateRange.startDate) } : null;
	const triggerLabel = getOverviewDateRangeLabel(dateRange, fallbackLabel);

	return (
		<DateRangePicker
			aria-label={`Dashboard date range, ${triggerLabel}`}
			className="relative"
			onChange={(nextValue) => {
				if (nextValue) {
					onDateRangeChange?.({
						endDate: nextValue.end.toString(),
						startDate: nextValue.start.toString(),
					});
				}
			}}
			value={value}
		>
			<Label className="sr-only">Dashboard date range</Label>

			<AriaButton
				className="focus-ring-rac ease inline-flex h-11 min-w-0 max-w-full items-center gap-2 rounded-md border border-border bg-shell-elevated px-4 font-semibold text-m text-shell-foreground transition-[border-color,box-shadow] duration-150 data-open:border-primary-subtle-border"
				isDisabled={!onDateRangeChange}
			>
				<CalendarDays aria-hidden className="size-4 shrink-0" />

				<span className="truncate whitespace-nowrap">{triggerLabel}</span>

				<ChevronDown aria-hidden className="size-4 shrink-0" />
			</AriaButton>

			<Popover
				className="z-50 mt-2 max-w-[calc(100vw-2rem)] rounded-md border border-border bg-panel p-3 text-panel-foreground shadow-[0_18px_48px_rgb(15_23_42/0.22)] outline-none"
				offset={8}
			>
				<Dialog>
					<RangeCalendar className="w-full max-w-[20rem]">
						<header className="mb-3 flex items-center justify-between">
							<CalendarNavButton slot="previous">
								<ChevronLeft aria-hidden className="size-4" />
							</CalendarNavButton>

							<Heading className="font-semibold text-m text-panel-foreground" />

							<CalendarNavButton slot="next">
								<ChevronRight aria-hidden className="size-4" />
							</CalendarNavButton>
						</header>

						<CalendarGrid className="w-full border-separate border-spacing-1">
							{(date) => (
								<CalendarCell
									className={cn(
										"focus-ring-rac ease size-9 rounded-md text-center text-s transition-[background-color,color,box-shadow] duration-150",
										"text-panel-foreground hover:bg-panel-muted data-disabled:text-muted-foreground/40 data-outside-month:text-muted-foreground",
										"data-selected:bg-primary/15 data-selected:text-panel-foreground",
										"data-selection-end:bg-primary data-selection-start:bg-primary data-selection-end:text-primary-foreground data-selection-start:text-primary-foreground",
									)}
									date={date}
								/>
							)}
						</CalendarGrid>
					</RangeCalendar>
				</Dialog>
			</Popover>
		</DateRangePicker>
	);
};

type CalendarNavButtonProps = {
	children: ReactNode;
	slot: "next" | "previous";
};

const CalendarNavButton = ({ children, slot }: CalendarNavButtonProps) => (
	<AriaButton
		className="focus-ring-rac ease flex size-8 items-center justify-center rounded-md text-muted-foreground transition-[background-color,color,box-shadow] duration-150 hover:bg-panel-muted hover:text-panel-foreground"
		slot={slot}
	>
		{children}
	</AriaButton>
);
