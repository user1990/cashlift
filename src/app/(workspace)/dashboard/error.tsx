"use client";

import { Button } from "@/ui/components/actions/Button";
import { Panel } from "@/ui/components/layout/Panel";
import { PanelHeader } from "@/ui/components/layout/PanelHeader";

type DashboardErrorProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
	return (
		<Panel className="mt-6" variant="accent">
			<PanelHeader label="Workspace" title="This dashboard view failed to load" />

			<p className="text-m text-muted-foreground leading-6">{error.message}</p>

			<Button className="mt-4" onPress={reset} variant="secondary">
				Try again
			</Button>
		</Panel>
	);
}
