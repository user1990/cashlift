import Link from "next/link";
import { cn } from "@/ui/utils/cn";
import { EXPLORE_DIRECTION_IDS, EXPLORE_DIRECTIONS, type ExploreDirectionId } from "./directions";

type ExploreFrameProps = {
	children: React.ReactNode;
	direction: ExploreDirectionId;
};

export const ExploreFrame = ({ children, direction }: ExploreFrameProps) => {
	const current = EXPLORE_DIRECTIONS[direction];
	const cockpit = direction === "c";

	return (
		<div className="space-y-6">
			<div
				className={
					cockpit
						? "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
						: "flex flex-col gap-4 border-border border-b pb-5 lg:flex-row lg:items-end lg:justify-between"
				}
			>
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
								className={`${cockpit ? "rounded-full px-4" : "rounded-md px-3"} ${getDirectionLinkClassName({
									cockpit,
									selected,
								})}`}
								href={item.href}
							>
								{item.name}
							</Link>
						);
					})}

					<Link
						className={`${cockpit ? "rounded-full px-4" : "rounded-md px-3"} ease inline-flex min-h-11 items-center border border-transparent font-semibold text-m text-muted-foreground outline-none transition-colors duration-150 hover:text-panel-foreground focus-visible:ring-[3px] focus-visible:ring-primary/20`}
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

function getDirectionLinkClassName({ cockpit, selected }: { cockpit: boolean; selected: boolean }) {
	return cn(
		"ease inline-flex min-h-11 items-center font-semibold text-m outline-none transition-[background-color,border-color,color,box-shadow] duration-150 focus-visible:ring-[3px] focus-visible:ring-primary/20",
		selected &&
			cockpit &&
			"border border-primary/40 bg-panel/45 text-panel-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.14)] backdrop-blur-md",
		selected && !cockpit && "border border-primary-subtle-border bg-primary-subtle text-panel-foreground",
		!selected &&
			"border border-shell-border text-shell-muted hover:border-primary-subtle-border hover:text-panel-foreground",
	);
}
