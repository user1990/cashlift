import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { MoneyCents } from "@/modules/money/types";
import { cn } from "@/ui/utils/cn";
import type { DashboardViewModel } from "../types";
import { formatExploreExactMoney, formatExploreMoney, formatPriorityLabel } from "./exploreModel";

type CashActionPriority = DashboardViewModel["actionInbox"][number]["priority"];

type ExploreMoneyProps = {
	cents: MoneyCents;
	exact?: boolean;
	className?: string;
	warning?: boolean;
};

export const ExploreMoney = ({ cents, className, exact = false, warning = false }: ExploreMoneyProps) => (
	<span
		className={
			warning
				? `font-mono font-semibold text-warning tabular-nums tracking-normal ${className ?? ""}`
				: `font-mono font-semibold text-panel-foreground tabular-nums tracking-normal ${className ?? ""}`
		}
	>
		{exact ? formatExploreExactMoney(cents) : formatExploreMoney(cents)}
	</span>
);

type PriorityCueProps = {
	priority: CashActionPriority;
	className?: string;
};

export const PriorityCue = ({ className, priority }: PriorityCueProps) => (
	<span className={cn("inline-flex items-center gap-1.5 text-s", className)}>
		<span
			aria-hidden
			className={cn(
				"size-1.5 rounded-full",
				priority === "critical" && "bg-destructive",
				priority === "high" && "bg-warning",
				priority === "medium" && "bg-shell-muted",
				priority === "low" && "bg-border-strong",
			)}
		/>

		<span
			className={cn(
				priority === "critical" && "text-destructive",
				priority === "high" && "text-warning",
				(priority === "medium" || priority === "low") && "text-muted-foreground",
			)}
		>
			{formatPriorityLabel(priority)}
		</span>
	</span>
);

type ExploreLinkProps = {
	children: ReactNode;
	href: string;
	primary?: boolean;
	className?: string;
};

export const ExploreLink = ({ children, className, href, primary = false }: ExploreLinkProps) => {
	const Icon = primary ? ArrowUpRight : ArrowRight;

	return (
		<Link
			className={cn(
				"ease inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-3 font-semibold text-m outline-none transition-[background-color,border-color,color,box-shadow] duration-150 focus-visible:ring-[3px] focus-visible:ring-primary/20",
				primary
					? "border border-primary/80 bg-primary text-primary-foreground shadow-primary-glow hover:border-primary-hover hover:bg-primary-hover"
					: "border border-shell-border bg-shell-elevated text-shell-foreground hover:border-primary-subtle-border hover:text-primary",
				className,
			)}
			href={href}
		>
			{children}

			<Icon aria-hidden className="size-4" />
		</Link>
	);
};

type ExploreKickerProps = {
	children: ReactNode;
};

export const ExploreKicker = ({ children }: ExploreKickerProps) => (
	<p className="text-muted-foreground text-s">{children}</p>
);

type SupportNoteListProps = {
	notes: string[];
};

export const SupportNoteList = ({ notes }: SupportNoteListProps) => (
	<aside>
		<p className="text-muted-foreground text-s">Requires backend/product support</p>

		<ul className="mt-2 space-y-1 text-muted-foreground text-s leading-5">
			{notes.map((note) => (
				<li key={note}>{note}</li>
			))}
		</ul>
	</aside>
);
