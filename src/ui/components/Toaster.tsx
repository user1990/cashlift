"use client";

import { Toaster as SonnerToaster } from "sonner";

export const Toaster = () => (
	<div data-slot="sonner">
		<SonnerToaster
			duration={5_000}
			expand
			gap={12}
			offset={24}
			position="top-right"
			toastOptions={{
				classNames: {
					actionButton: "bg-primary text-primary-foreground",
					cancelButton: "bg-panel-muted text-shell-foreground",
					closeButton: "border-shell-border bg-panel text-shell-foreground",
					description: "text-s text-shell-muted",
					error: "border-highlight/60",
					success: "border-signal/60",
					title: "text-m font-semibold text-shell-foreground",
					toast: "border border-shell-border bg-shell-elevated text-shell-foreground shadow-shell",
					warning: "border-warning/60",
				},
			}}
		/>
	</div>
);
