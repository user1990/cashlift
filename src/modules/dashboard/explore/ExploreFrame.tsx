import Link from "next/link";
import { cn } from "@/ui/utils/cn";
import { EXPLORE_DIRECTION_IDS, EXPLORE_DIRECTIONS, type ExploreDirectionId } from "./directions";

type ExploreFrameProps = {
	children: React.ReactNode;
	direction: ExploreDirectionId;
};

export const ExploreFrame = ({ children, direction }: ExploreFrameProps) => {
	const current = EXPLORE_DIRECTIONS[direction];

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 border-border border-b pb-5 lg:flex-row lg:items-end lg:justify-between">
				<div className="min-w-0">
					<p className="text-muted-foreground text-s">Design prototype · production overview is unchanged</p>

					<p className="mt-1 font-semibold text-2xl+ text-panel-foreground tracking-normal">{current.name}</p>

					<p className="mt-1 max-w-2xl text-m text-shell-muted leading-6">{current.summary}</p>
				</div>

				<nav aria-label="Prototype directions" className="flex flex-wrap gap-2">
					{EXPLORE_DIRECTION_IDS.map((id) => {
						const item = EXPLORE_DIRECTIONS[id];
						const selected = id === direction;

						return (
							<Link
								key={id}
								aria-current={selected ? "page" : undefined}
								className={cn(
									"ease inline-flex min-h-11 items-center rounded-md px-3 font-semibold text-m outline-none transition-[background-color,border-color,color] duration-150 focus-visible:ring-[3px] focus-visible:ring-primary/20",
									selected
										? "border border-primary-subtle-border bg-primary-subtle text-panel-foreground"
										: "border border-shell-border text-shell-muted hover:border-primary-subtle-border hover:text-panel-foreground",
								)}
								href={item.href}
							>
								{item.name}
							</Link>
						);
					})}

					<Link
						className="ease inline-flex min-h-11 items-center rounded-md border border-transparent px-3 font-semibold text-m text-muted-foreground outline-none transition-colors duration-150 hover:text-panel-foreground focus-visible:ring-[3px] focus-visible:ring-primary/20"
						href="/dashboard"
					>
						Production overview
					</Link>
				</nav>
			</div>

			{children}
		</div>
	);
};
