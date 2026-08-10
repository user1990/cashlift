import { tv, type VariantProps } from "tailwind-variants";

const BADGE_VARIANTS = tv({
	base: "inline-flex min-h-6 max-w-full items-center rounded-full px-2.5 py-0.5 text-2xs+ font-semibold uppercase tracking-normal ring-1 ring-inset",
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

type BadgeVariant = "accent" | "danger" | "neutral" | "primary" | "success" | "warning";

type BadgeProps = Omit<VariantProps<typeof BADGE_VARIANTS>, "variant"> & {
	children: React.ReactNode;
	className?: string;
	variant?: BadgeVariant;
};

export const Badge = ({ children, className, variant = "neutral" }: BadgeProps) => (
	<span className={BADGE_VARIANTS({ className, variant })} data-slot="badge" data-variant={variant}>
		{children}
	</span>
);
