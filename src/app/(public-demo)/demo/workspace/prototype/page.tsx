import { Suspense } from "react";
import { OverviewPrototypePage } from "@/modules/dashboard/prototype/OverviewPrototypePage";
import { DEMO_WORKSPACE_DATASET } from "@/modules/workspace/demoDataset";

export default function DemoOverviewPrototypeRoute() {
	return (
		<Suspense fallback={<p className="text-m text-muted-foreground">Loading prototype…</p>}>
			<OverviewPrototypePage dataset={DEMO_WORKSPACE_DATASET} />
		</Suspense>
	);
}
