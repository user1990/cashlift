import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button, Disclosure, DisclosurePanel } from "react-aria-components";
import { cn } from "@/ui/utils/cn";
import type { NavGroup } from "./marketingHeaderNavigation";

type DesktopNavGroupProps = {
	group: NavGroup;
	onClose: () => void;
	onHoverEnd: () => void;
	onHoverStart: () => void;
	onTriggerFocus: (trigger: HTMLButtonElement) => void;
	pathname: string;
};

export const DesktopNavGroup = ({
	group,
	onClose,
	onHoverEnd,
	onHoverStart,
	onTriggerFocus,
	pathname,
}: DesktopNavGroupProps) => (
	<Disclosure
		id={group.label}
		onPointerEnter={(event) => {
			if (event.pointerType === "mouse") {
				onHoverStart();
			}
		}}
		onPointerLeave={(event) => {
			if (event.pointerType === "mouse") {
				onHoverEnd();
			}
		}}
		className="group relative"
	>
		<Button
			onFocus={(event) => onTriggerFocus(event.currentTarget as HTMLButtonElement)}
			slot="trigger"
			className="flex h-9 cursor-pointer items-center gap-1 rounded-md px-3 text-m font-medium text-shell-muted outline-none transition-colors duration-150 hover:text-primary data-focus-visible:ring-[3px] data-focus-visible:ring-primary/20"
		>
			{group.label}

			<ChevronDown aria-hidden className="size-4 transition-transform duration-150 group-data-[expanded]:rotate-180" />
		</Button>

		<DisclosurePanel className="absolute left-0 top-full z-10 w-48 pt-2">
			<div className="rounded-lg border border-shell-border bg-shell-elevated p-1 shadow-shell">
				<ul className="grid gap-1">
					{group.items.map(({ href, label }) => {
						const active = pathname === href || pathname.startsWith(`${href}/`);

						return (
							<li key={href}>
								<Link
									aria-current={active ? "page" : undefined}
									href={href}
									onClick={onClose}
									className={cn(
										"block rounded-md px-3 py-2 text-m font-medium text-shell-muted outline-none transition-colors duration-150 hover:bg-panel/10 hover:text-shell-foreground focus-visible:ring-[3px] focus-visible:ring-primary/20",
										active && "bg-primary/10 text-primary",
									)}
								>
									{label}
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		</DisclosurePanel>
	</Disclosure>
);
