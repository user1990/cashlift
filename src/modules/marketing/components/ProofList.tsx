import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { Panel } from "@/ui/components/layout/Panel";
import { cn } from "@/ui/utils/cn";
import { ProofPoint } from "./ProofPoint";

type ProofListProps = {
	items: readonly ProofListItem[];
	variant?: "panel" | "shell";
};

type ProofListItem = {
	icon: LucideIcon;
	image: string;
	metric: string;
	text: string;
};

export const ProofList = ({ items, variant = "panel" }: ProofListProps) =>
	variant === "panel" ? (
		<ul className="mt-10 grid gap-3">
			{items.map(({ icon: Icon, image, metric, text }, index) => (
				<li key={metric} className="relative">
					<Panel as="article" variant="glass" className="relative overflow-hidden p-0">
						<Image
							alt=""
							aria-hidden
							fill
							loading="eager"
							sizes="(min-width: 1180px) 1120px, calc(100vw - 2rem)"
							src={image}
							className="object-cover opacity-55"
						/>

						<div aria-hidden className="absolute inset-0 bg-shell/55" />

						<div
							className={cn(
								"relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-2 p-5 md:grid-cols-[auto_minmax(9rem,0.3fr)_minmax(0,1fr)] md:gap-x-6",
								index < items.length - 1 && "pb-8 md:pb-6",
							)}
						>
							<ProofPoint
								Icon={Icon}
								metric={metric}
								metricClassName="row-start-1 text-4xl+ text-primary-strong sm:text-5xl+"
								term="Customer proof point"
								text={text}
								textClassName="col-start-2 row-start-2 text-shell-foreground/85 md:col-start-3 md:row-start-1"
							/>
						</div>
					</Panel>
					{index < items.length - 1 && (
						<span
							aria-hidden
							className="pointer-events-none absolute bottom-0 left-10 z-10 h-3 border-primary/45 border-l"
						/>
					)}
				</li>
			))}
		</ul>
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
