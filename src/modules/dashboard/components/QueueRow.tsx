import type { ReactNode } from "react";
import { cn } from "@/ui/utils/cn";

type QueueRowProps = {
	title: ReactNode;
	icon?: ReactNode;
	meta?: ReactNode;
	value?: ReactNode;
	variant?: "primary" | "plain";
};

export const QueueRow = ({ icon, meta, title, value, variant = "plain" }: QueueRowProps) => (
	<li className={cn(variant === "primary" && "rounded-lg border border-primary-muted/80 bg-primary-subtle p-4")}>
		<div className="flex items-center justify-between gap-3">
			<div className="flex items-center gap-3">
				{icon}

				<div>
					<p className="font-semibold text-m+ text-panel-foreground">{title}</p>

					{meta && <p className="mt-1 text-s text-shell-muted">{meta}</p>}
				</div>
			</div>

			{value && <span className="font-mono text-m+ text-primary">{value}</span>}
		</div>
	</li>
);
