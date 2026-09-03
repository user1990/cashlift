import type { LucideIcon } from "lucide-react";
import { Panel } from "@/ui/components/layout/Panel";
import { cn } from "@/ui/utils/cn";

type IconCardProps = {
	description: string;
	Icon: LucideIcon;
	title: string;
	featured?: boolean;
};

export const IconCard = ({ description, Icon, title, featured = false }: IconCardProps) => (
	<Panel
		as="article"
		variant="glass"
		className={cn(
			"relative isolate h-full overflow-hidden bg-shell-elevated/55 p-0 shadow-none backdrop-blur-md",
			"ease transition-[border-color,box-shadow,transform] duration-[var(--motion-duration-standard)]",
			"before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-px before:bg-linear-to-r before:from-transparent before:via-shell-foreground/35 before:to-transparent before:content-['']",
			"group-hover:-translate-y-1 group-hover:border-primary/55 group-hover:shadow-primary-glow",
			"motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:transform-none",
			featured && "border-primary/55 bg-linear-to-br from-primary/12 via-shell-elevated/70 to-shell/70",
		)}
	>
		<div className="relative flex min-h-28 items-end overflow-hidden border-shell-border border-b bg-linear-to-br from-primary/10 via-shell-elevated/70 to-shell/85 p-5 sm:min-h-32 sm:p-6">
			<div aria-hidden className="absolute top-5 right-5 grid w-24 gap-2 opacity-70 sm:top-6 sm:right-6">
				<span className="h-1 rounded-full bg-primary/45" />

				<span className="h-1 w-3/4 justify-self-end rounded-full bg-shell-border" />

				<span className="h-1 w-1/2 justify-self-end rounded-full bg-shell-border/70" />
			</div>

			<span className="relative grid size-12 place-items-center rounded-lg border border-primary/35 bg-primary-subtle/70 text-primary shadow-shell">
				<Icon aria-hidden className="size-5 stroke-[1.75]" />
			</span>
		</div>

		<div className="relative p-5 sm:p-6">
			<h2 className="text-panel-foreground text-xl+">{title}</h2>

			<p className="mt-2 text-m text-muted-foreground leading-6">{description}</p>
		</div>
	</Panel>
);
