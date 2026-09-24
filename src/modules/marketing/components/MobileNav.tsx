"use client";

import { Menu, X } from "lucide-react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import { usePathKeyedDrawer } from "@/ui/hooks/usePathKeyedDrawer";
import type { NavGroup } from "../navigation";
import { MARKETING_NAV_GROUPS } from "../navigation";
import { MobileNavLink } from "./MobileNavLink";

export const MobileNav = () => {
	const { closeDrawer, drawerId, open, toggleDrawer } = usePathKeyedDrawer("(min-width: 64rem)");

	return (
		<div className="lg:hidden">
			<button
				aria-controls={drawerId}
				aria-expanded={open}
				aria-label={open ? "Close navigation" : "Open navigation"}
				onClick={toggleDrawer}
				type="button"
				className="focus-ring inline-flex size-11 cursor-pointer items-center justify-center rounded-md border border-shell-border bg-shell-elevated text-shell-foreground transition-[border-color,color] duration-150 hover:border-primary-subtle-border hover:text-primary"
			>
				{open ? <X aria-hidden className="size-4" /> : <Menu aria-hidden className="size-4" />}
			</button>

			<ModalOverlay
				isDismissable
				isOpen={open}
				onOpenChange={(nextOpen) => {
					if (!nextOpen) {
						closeDrawer();
					}
				}}
				className="fixed inset-0 z-40 flex lg:hidden"
			>
				<Modal className="ml-auto h-full w-[min(100vw-3rem,18rem)] outline-none">
					<Dialog
						aria-label="Mobile navigation"
						id={drawerId}
						className="flex h-full flex-col border-shell-border border-l bg-shell shadow-shell outline-none"
					>
						<div className="flex justify-end border-shell-border border-b px-3 py-2">
							<button
								aria-label="Close navigation"
								onClick={closeDrawer}
								type="button"
								className="focus-ring inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-shell-foreground transition-[color] duration-150 hover:text-primary"
							>
								<X aria-hidden className="size-4" />
							</button>
						</div>

						<nav
							aria-label="Mobile navigation"
							className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6"
						>
							<div className="mx-auto grid max-w-295 gap-5">
								{MARKETING_NAV_GROUPS.map(({ items, label }) => (
									<MobileNavGroupSection key={label} group={{ items, label }} onNavigate={closeDrawer} />
								))}

								<MobileNavLink href="/customers" onNavigate={closeDrawer}>
									Customers
								</MobileNavLink>
							</div>
						</nav>
					</Dialog>
				</Modal>
			</ModalOverlay>
		</div>
	);
};

function MobileNavGroupSection({ group, onNavigate }: { group: NavGroup; onNavigate: () => void }) {
	const headingId = `mobile-nav-${group.label.toLowerCase()}`;

	return (
		<section aria-labelledby={headingId}>
			<p id={headingId} className="px-3 text-primary text-s+ uppercase tracking-normal">
				{group.label}
			</p>

			<div className="mt-2 grid gap-1 pl-3">
				{group.items.map(({ href, label }) => (
					<MobileNavLink key={href} href={href} onNavigate={onNavigate}>
						{label}
					</MobileNavLink>
				))}
			</div>
		</section>
	);
}
