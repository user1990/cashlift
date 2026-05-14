import { cn } from "@/modules/ui/utils/cn";

type PanelProps = {
	as?: "article" | "div" | "section";
	children: React.ReactNode;
	className?: string;
	variant?: "light" | "glass" | "accent";
};

export const Panel = ({ as: Component = "div", children, className, variant = "light" }: PanelProps) => (
	<Component
		className={cn(
			"rounded-lg border p-4 transition-[border-color,box-shadow] duration-150 ease",
			variant === "light" && "border-border bg-panel text-panel-foreground shadow-panel",
			variant === "glass" &&
				"border-shell-border bg-shell-elevated/80 text-shell-foreground shadow-shell backdrop-blur",
			variant === "accent" && "border-primary-subtle-border bg-primary-subtle text-panel-foreground shadow-panel",
			className,
		)}
	>
		{children}
	</Component>
);

type PanelHeaderProps = {
	action?: React.ReactNode;
	eyebrow?: string;
	title: string;
};

export const PanelHeader = ({ action, eyebrow, title }: PanelHeaderProps) => (
	<div className="mb-4 flex items-start justify-between gap-4">
		<div>
			{eyebrow && <p className="mb-1 text-2xs+ uppercase tracking-normal text-muted-foreground">{eyebrow}</p>}

			<h2 className="text-l+ text-panel-foreground">{title}</h2>
		</div>

		{action}
	</div>
);
