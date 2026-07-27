import { tv, type VariantProps } from "tailwind-variants";

const badgeVariants = tv({
	base: "inline-flex h-6 max-w-full items-center rounded-full px-2.5 text-2xs+ font-semibold uppercase tracking-normal ring-1 ring-inset",
	defaultVariants: {
		variant: "neutral",
	},
	variants: {
		variant: {
			accent: "bg-highlight/10 text-highlight ring-highlight/30",
			danger: "bg-red-400/10 text-red-300 ring-red-400/30",
			neutral: "bg-shell-elevated/80 text-shell-muted ring-shell-border/80",
			primary: "bg-primary/10 text-primary ring-primary/30",
			success: "bg-signal/10 text-signal ring-signal/30",
			warning: "bg-warning/10 text-warning ring-warning/35",
		},
	},
});

const DEFAULT_BADGE_VARIANT = "neutral";

type BadgeProps = Omit<VariantProps<typeof badgeVariants>, "variant"> & {
	children: React.ReactNode;
	className?: string;
	variant?: "accent" | "danger" | "neutral" | "primary" | "success" | "warning";
};

export const Badge = ({ children, className, variant }: BadgeProps) => {
	const selectedVariant = variant ?? DEFAULT_BADGE_VARIANT;

	return (
		<span
			className={badgeVariants({ className, variant: selectedVariant })}
			data-slot="badge"
			data-variant={selectedVariant}
		>
			{children}
		</span>
	);
};
