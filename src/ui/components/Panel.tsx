import { tv, type VariantProps } from "tailwind-variants";

export { PanelHeader } from "@/ui/components/PanelHeader";

const panelVariants = tv({
	base: "rounded-lg border p-4 transition-[border-color,box-shadow] duration-150 ease",
	defaultVariants: {
		variant: "light",
	},
	variants: {
		variant: {
			accent: "border-primary-subtle-border bg-primary-subtle text-panel-foreground shadow-panel",
			glass: "border-shell-border bg-shell-elevated/80 text-shell-foreground shadow-shell backdrop-blur",
			light: "border-border bg-panel text-panel-foreground shadow-panel",
		},
	},
});

type PanelVariant = "accent" | "glass" | "light";

type PanelProps = Omit<VariantProps<typeof panelVariants>, "variant"> & {
	children: React.ReactNode;
	as?: "article" | "div" | "section";
	className?: string;
	variant?: PanelVariant;
};

export const Panel = ({ as = "div", children, variant = "light", className }: PanelProps) => {
	const panelProps = {
		className: panelVariants({ className, variant }),
		"data-slot": "card",
		"data-variant": variant,
	};

	if (as === "article") {
		return <article {...panelProps}>{children}</article>;
	}

	if (as === "section") {
		return <section {...panelProps}>{children}</section>;
	}

	return <div {...panelProps}>{children}</div>;
};
