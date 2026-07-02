import { cn } from "@/ui/utils/cn";

type BadgeProps = {
	children: React.ReactNode;
	variant?: "accent" | "danger" | "neutral" | "primary" | "success" | "warning";
	className?: string;
};

export const Badge = ({ children, className, variant = "neutral" }: BadgeProps) => (
	<span
		className={cn(
			"inline-flex h-6 max-w-full items-center rounded-full border px-2 text-2xs+ font-medium uppercase tracking-normal",
			variant === "neutral" && "border-shell-border bg-shell-elevated text-shell-muted",
			variant === "primary" && "border-primary-subtle-border bg-primary-subtle text-primary",
			variant === "success" && "border-signal/60 bg-signal-subtle text-signal",
			variant === "warning" && "border-warning/60 bg-warning-subtle text-warning",
			variant === "danger" && "border-red-400/50 bg-red-400/10 text-red-300",
			variant === "accent" && "border-highlight/60 bg-highlight-subtle text-highlight",
			className,
		)}
	>
		{children}
	</span>
);
