"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import type { NavGroup } from "../navigation";
import { MARKETING_NAV_GROUPS } from "../navigation";
import { MobileNavLink } from "./MobileNavLink";

export const MobileNav = () => {
	const drawerId = useId();
	const pathname = usePathname() ?? "";
	const [openPath, setOpenPath] = useState<string | null>(null);
	const open = openPath === pathname;

	useEffect(() => {
		if (!open) {
			return;
		}

		if (typeof window.matchMedia !== "function") {
			return;
		}

		const mediaQuery = window.matchMedia("(min-width: 64rem)");
		const closeOnDesktop = () => {
			if (mediaQuery.matches) {
				setOpenPath(null);
			}
		};
		closeOnDesktop();
		mediaQuery.addEventListener("change", closeOnDesktop);

		return () => mediaQuery.removeEventListener("change", closeOnDesktop);
	}, [open]);

	const closeDrawer = () => {
		setOpenPath(null);
	};

	const toggleDrawer = () => {
		setOpenPath((currentPath) => (currentPath === pathname ? null : pathname));
	};

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
				<Modal className="ml-auto h-full w-full max-w-none outline-none sm:max-w-md">
					<Dialog
						aria-label="Mobile navigation"
						id={drawerId}
						className="flex h-full flex-col border-shell-border border-l bg-shell shadow-shell outline-none"
					>
						<nav
							aria-label="Mobile navigation"
							className="max-h-full overflow-y-auto overscroll-contain px-4 py-4 sm:px-6"
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
