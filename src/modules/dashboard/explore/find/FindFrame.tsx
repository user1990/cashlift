import Link from "next/link";
import type { ReactNode } from "react";
import { FIND_DIRECTION_IDS, FIND_DIRECTIONS, type FindDirectionId } from "./directions";

type FindFrameProps = {
	children: ReactNode;
	direction: FindDirectionId;
};

export const FindFrame = ({ children, direction }: FindFrameProps) => {
	const current = FIND_DIRECTIONS[direction];

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 border-border border-b pb-5 lg:flex-row lg:items-end lg:justify-between">
				<div className="min-w-0">
					<p className="text-muted-foreground text-s">Design prototype · production lists are unchanged</p>

					<p className="mt-1 font-semibold text-2xl+ text-panel-foreground tracking-normal">{current.name}</p>

					<p className="mt-1 max-w-2xl text-m text-shell-muted leading-6">{current.summary}</p>
				</div>

				<nav aria-label="Find prototype directions" className="flex flex-wrap gap-2">
					{FIND_DIRECTION_IDS.map((id) => {
						const item = FIND_DIRECTIONS[id];
						const selected = id === direction;

						return (
							<Link
								key={id}
								aria-current={selected ? "page" : undefined}
								className={
									selected
										? "ease inline-flex min-h-11 items-center rounded-md border border-primary-subtle-border bg-primary-subtle px-3 font-semibold text-m text-panel-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20"
										: "ease inline-flex min-h-11 items-center rounded-md border border-shell-border px-3 font-semibold text-m text-shell-muted outline-none hover:border-primary-subtle-border hover:text-panel-foreground focus-visible:ring-[3px] focus-visible:ring-primary/20"
								}
								href={item.href}
							>
								{item.name}
							</Link>
						);
					})}

					<Link
						className="ease inline-flex min-h-11 items-center rounded-md px-3 font-semibold text-m text-muted-foreground outline-none hover:text-panel-foreground focus-visible:ring-[3px] focus-visible:ring-primary/20"
						href="/dashboard/explore"
					>
						Overview prototypes
					</Link>
				</nav>
			</div>

			{children}
		</div>
	);
};
