"use client";

import { parseDate } from "@internationalized/date";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import {
	Button as AriaButton,
	CalendarCell,
	CalendarGrid,
	DateInput,
	DateRangePicker,
	DateSegment,
	Dialog,
	Group,
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

	return (
		<DateRangePicker
			aria-label="Dashboard date range"
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

			<Group className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-shell-elevated px-4 text-m font-semibold text-shell-foreground outline-none transition-[border-color,box-shadow] duration-150 ease data-focus-visible:ring-[3px] data-focus-visible:ring-primary/20 data-open:border-primary-subtle-border">
				<CalendarDays aria-hidden className="size-4 shrink-0" />

				<span aria-hidden className="whitespace-nowrap">
					{getOverviewDateRangeLabel(dateRange, fallbackLabel)}
				</span>

				<DateInput className="sr-only" slot="start">
					{(segment) => <DateSegment segment={segment} />}
				</DateInput>

				<DateInput className="sr-only" slot="end">
					{(segment) => <DateSegment segment={segment} />}
				</DateInput>

				<AriaButton
					className="flex size-5 items-center cursor-pointer justify-center rounded-sm text-shell-foreground outline-none transition-[color] duration-150 ease hover:text-primary data-focus-visible:ring-[3px] data-focus-visible:ring-primary/20"
					isDisabled={!onDateRangeChange}
				>
					<ChevronDown aria-hidden className="size-4" />
				</AriaButton>
			</Group>

			<Popover
				className="z-50 mt-2 rounded-md border border-border bg-panel p-3 text-panel-foreground shadow-[0_18px_48px_rgb(15_23_42/0.22)] outline-none"
				offset={8}
			>
				<Dialog>
					<RangeCalendar className="w-[20rem]">
						<header className="mb-3 flex items-center justify-between">
							<CalendarNavButton slot="previous">
								<ChevronLeft aria-hidden className="size-4" />
							</CalendarNavButton>

							<Heading className="text-m font-semibold text-panel-foreground" />

							<CalendarNavButton slot="next">
								<ChevronRight aria-hidden className="size-4" />
							</CalendarNavButton>
						</header>

						<CalendarGrid className="w-full border-separate border-spacing-1">
							{(date) => (
								<CalendarCell
									className={cn(
										"size-9 rounded-md text-center text-s outline-none transition-[background-color,color,box-shadow] duration-150 ease",
										"text-panel-foreground hover:bg-panel-muted data-disabled:text-muted-foreground/40 data-outside-month:text-muted-foreground",
										"data-focus-visible:ring-[3px] data-focus-visible:ring-primary/20 data-selected:bg-primary data-selected:text-primary-foreground",
										"data-selection-start:bg-primary data-selection-start:text-primary-foreground data-selection-end:bg-primary data-selection-end:text-primary-foreground",
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
		className="flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-[background-color,color,box-shadow] duration-150 ease hover:bg-panel-muted hover:text-panel-foreground data-focus-visible:ring-[3px] data-focus-visible:ring-primary/20"
		slot={slot}
	>
		{children}
	</AriaButton>
);
