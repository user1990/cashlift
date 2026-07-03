import { cn } from "@/ui/utils/cn";

type BadgeProps = {
	children: React.ReactNode;
	variant?: "accent" | "danger" | "neutral" | "primary" | "success" | "warning";
	className?: string;
};

export const Badge = ({ children, className, variant = "neutral" }: BadgeProps) => (
	<span
		className={cn(
			"inline-flex h-6 max-w-full items-center rounded-full px-2.5 text-2xs+ font-semibold uppercase tracking-normal ring-1 ring-inset",
			variant === "neutral" && "bg-shell-elevated/80 text-shell-muted ring-shell-border/80",
			variant === "primary" && "bg-primary/10 text-primary ring-primary/30",
			variant === "success" && "bg-signal/10 text-signal ring-signal/30",
			variant === "warning" && "bg-warning/10 text-warning ring-warning/35",
			variant === "danger" && "bg-red-400/10 text-red-300 ring-red-400/30",
			variant === "accent" && "bg-highlight/10 text-highlight ring-highlight/30",
			className,
		)}
	>
		{children}
	</span>
);
