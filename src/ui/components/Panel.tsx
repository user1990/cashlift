import { cn } from "@/ui/utils/cn";

export { PanelHeader } from "@/ui/components/PanelHeader";

type PanelProps = {
	children: React.ReactNode;
	as?: "article" | "div" | "section";
	variant?: "light" | "glass" | "accent";
	className?: string;
};

export const Panel = ({ as = "div", children, variant = "light", className }: PanelProps) => {
	const panelClassName = cn(
		"rounded-lg border p-4 transition-[border-color,box-shadow] duration-150 ease",
		variant === "light" && "border-border bg-panel text-panel-foreground shadow-panel",
		variant === "glass" && "border-shell-border bg-shell-elevated/80 text-shell-foreground shadow-shell backdrop-blur",
		variant === "accent" && "border-primary-subtle-border bg-primary-subtle text-panel-foreground shadow-panel",
		className,
	);

	if (as === "article") {
		return <article className={panelClassName}>{children}</article>;
	}

	if (as === "section") {
		return <section className={panelClassName}>{children}</section>;
	}

	return <div className={panelClassName}>{children}</div>;
};
