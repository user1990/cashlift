import type { LucideIcon } from "lucide-react";
import { Panel } from "@/ui/components/Panel";

type MarketingIconCardProps = {
	description: string;
	Icon: LucideIcon;
	title: string;
};

export const MarketingIconCard = ({ description, Icon, title }: MarketingIconCardProps) => (
	<Panel as="article">
		<Icon aria-hidden className="size-5 text-primary" />

		<h2 className="mt-4 text-xl+ text-panel-foreground">{title}</h2>

		<p className="mt-2 text-m leading-6 text-muted-foreground">{description}</p>
	</Panel>
);
