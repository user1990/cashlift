import { cn } from "@/ui/utils/cn";
import { ActionLink } from "./ActionLink";

type UseCaseDemoCtaSectionProps = {
	centered?: boolean;
};

export const UseCaseDemoCtaSection = ({ centered = false }: UseCaseDemoCtaSectionProps) => (
	<div className={cn("mt-8", centered && "flex justify-center")}>
		<ActionLink href="/demo">Book a walkthrough</ActionLink>
	</div>
);
