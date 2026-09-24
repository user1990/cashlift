"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import logo from "@/ui/assets/logo.svg";
import { usePathKeyedDrawer } from "@/ui/hooks/usePathKeyedDrawer";
import { cn } from "@/ui/utils/cn";
import type { WorkspaceExperienceContract } from "../types";
import { WorkspaceAccountMenu } from "./WorkspaceAccountMenu";
import { WorkspaceSidebarPanel } from "./WorkspaceSidebarPanel";

type WorkspaceMobileNavProps = {
	workspace: WorkspaceExperienceContract;
};

export const WorkspaceMobileNav = ({ workspace }: WorkspaceMobileNavProps) => {
	const { closeDrawer, drawerId, open, toggleDrawer } = usePathKeyedDrawer("(min-width: 1024px)");

	return (
		<>
			<header
				className={cn("sticky top-0 z-30 border-white/5 border-b bg-shell/95 backdrop-blur lg:hidden", open && "z-50")}
			>
				<div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3">
					<button
						aria-controls={drawerId}
						aria-expanded={open}
						aria-label={open ? "Close navigation" : "Open navigation"}
						className="ease focus-ring inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-black/30 text-shell-foreground outline-none transition-[border-color,color] duration-150 hover:border-primary/40 hover:text-primary"
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

			<ModalOverlay
				className="fixed inset-0 z-40 flex lg:hidden"
				isDismissable
				isOpen={open}
				onOpenChange={(nextOpen) => {
					if (!nextOpen) {
						closeDrawer();
					}
				}}
			>
				<Modal className="h-full w-[min(100vw-3rem,18rem)] outline-none">
					<Dialog
						aria-label="Workspace navigation"
						className="flex h-full flex-col border-white/5 border-r bg-shell p-3 shadow-shell outline-none"
						id={drawerId}
					>
						<div className="mb-2 flex items-center justify-end lg:hidden">
							<button
								aria-label="Close navigation"
								className="ease focus-ring inline-flex size-11 cursor-pointer items-center justify-center rounded-md border border-white/10 text-shell-foreground outline-none transition-[border-color,color] duration-150 hover:border-primary/40 hover:text-primary"
								onClick={closeDrawer}
								type="button"
							>
								<X aria-hidden className="size-5" />
							</button>
						</div>

						<WorkspaceSidebarPanel
							onNavigate={closeDrawer}
							showAccountMenu={false}
							showLogo={false}
							workspace={workspace}
						/>
					</Dialog>
				</Modal>
			</ModalOverlay>
		</>
	);
};
