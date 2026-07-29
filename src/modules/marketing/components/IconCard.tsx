import type { LucideIcon } from "lucide-react";
import { Panel } from "@/ui/components/layout/Panel";

type IconCardProps = {
	description: string;
	Icon: LucideIcon;
	title: string;
};

export const IconCard = ({ description, Icon, title }: IconCardProps) => (
	<Panel as="article" className="h-full">
		<Icon aria-hidden className="size-5 text-primary" />

		<h2 className="mt-4 text-xl+ text-panel-foreground">{title}</h2>

		<p className="mt-2 text-m leading-6 text-muted-foreground">{description}</p>
	</Panel>
);
