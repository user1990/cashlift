import type { LucideIcon } from "lucide-react";
import { Panel } from "@/ui/components/layout/Panel";
import { cn } from "@/ui/utils/cn";
import { ProofPoint } from "./ProofPoint";

type ProofListProps = {
	items: readonly ProofListItem[];
	variant?: "panel" | "shell";
};

type ProofListItem = {
	icon: LucideIcon;
	metric: string;
	text: string;
};

export const ProofList = ({ items, variant = "panel" }: ProofListProps) =>
	variant === "panel" ? (
		<Panel as="section" variant="glass" className="mt-10 overflow-hidden p-0">
			<ul>
				{items.map(({ icon: Icon, metric, text }, index) => (
					<li
						key={metric}
						className={cn(
							"grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-3 p-5 sm:p-6 md:grid-cols-[minmax(9rem,0.3fr)_auto_minmax(0,1fr)] md:items-center md:gap-x-6",
							index > 0 && "border-shell-border border-t",
						)}
					>
						<ProofPoint
							Icon={Icon}
							metric={metric}
							metricClassName="text-4xl+ text-primary-strong sm:text-5xl+"
							term="Customer proof point"
							text={text}
							textClassName="col-span-full text-muted-foreground md:col-span-1"
						/>
					</li>
				))}
			</ul>
		</Panel>
	) : (
		<ul className="contents">
			{items.map(({ metric, text }) => (
				<li key={metric}>
					<ProofPoint
						metric={metric}
						metricClassName="text-4xl+ text-primary"
						term="Proof point"
						text={text}
						textClassName="mt-2 text-shell-muted"
					/>
				</li>
			))}
		</ul>
	);
