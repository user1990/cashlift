"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import logo from "@/app/logo.svg";
import type { WorkspaceExperienceContract } from "../types";
import { WorkspaceAccountMenu } from "./WorkspaceAccountMenu";
import { WorkspaceSidebarPanel } from "./WorkspaceSidebarPanel";

type WorkspaceMobileNavProps = {
	workspace: WorkspaceExperienceContract;
};

export const WorkspaceMobileNav = ({ workspace }: WorkspaceMobileNavProps) => {
	const drawerId = useId();
	const pathname = usePathname() ?? "";
	const [openPath, setOpenPath] = useState<string | null>(null);
	const open = openPath === pathname;

	useEffect(() => {
		if (!open) {
			return;
		}

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [open]);

	const closeDrawer = () => {
		setOpenPath(null);
	};

	const toggleDrawer = () => {
		setOpenPath((currentPath) => (currentPath === pathname ? null : pathname));
	};

	return (
		<>
			<header className="sticky top-0 z-30 border-white/5 border-b bg-shell/95 backdrop-blur lg:hidden">
				<div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3">
					<button
						aria-controls={drawerId}
						aria-expanded={open}
						aria-label={open ? "Close navigation" : "Open navigation"}
						className="ease inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-black/30 text-shell-foreground outline-none transition-[border-color,color] duration-150 hover:border-primary/40 hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary/20"
						onClick={toggleDrawer}
						type="button"
					>
						{open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
					</button>

					<Link
						aria-label="CashLift workspace home"
						className="min-w-0 flex-1"
						href={workspace.basePath}
						onClick={closeDrawer}
					>
						<Image alt="CashLift Logo" className="h-8 w-auto" height={32} priority src={logo} width={166} />
					</Link>

					<WorkspaceAccountMenu compact placement="header" workspace={workspace} />
				</div>
			</header>

			{open && (
				<div className="fixed inset-0 z-40 lg:hidden">
					<button
						aria-label="Close navigation"
						className="absolute inset-0 bg-black/60 motion-reduce:transition-none"
						onClick={closeDrawer}
						type="button"
					/>

					<aside
						aria-label="Workspace navigation"
						className="ease relative z-10 flex h-full w-[min(100vw-3rem,18rem)] flex-col border-white/5 border-r bg-shell p-3 shadow-shell transition-transform duration-200 motion-reduce:transition-none"
						id={drawerId}
					>
						<WorkspaceSidebarPanel
							onNavigate={closeDrawer}
							showAccountMenu={false}
							showLogo={false}
							workspace={workspace}
						/>
					</aside>
				</div>
			)}
		</>
	);
};
