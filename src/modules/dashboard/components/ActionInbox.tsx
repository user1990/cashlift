import type { DashboardViewModel } from "../types";
import { ActionInboxItem } from "./ActionInboxItem";
import { DashboardPanel } from "./DashboardPanel";

type ActionInboxProps = {
	actions: DashboardViewModel["actionInbox"];
	basePath: string;
};

export const ActionInbox = ({ actions, basePath }: ActionInboxProps) => (
	<DashboardPanel label="Today's inbox" title="Ranked by cash impact, due date, and urgency">
		{actions.length ? (
			<ol className="divide-y divide-border">
				{actions.map(({ description, dueDate, id, impactCents, owner, priority, title, type }) => (
					<ActionInboxItem
						key={id}
						basePath={basePath}
						description={description}
						dueDate={dueDate}
						impactCents={impactCents}
						owner={owner}
						priority={priority}
						title={title}
						type={type}
					/>
				))}
			</ol>
		) : (
			<p className="rounded-lg border border-border bg-panel-muted p-4 text-m text-muted-foreground">
				You are clear for today. New cash decisions will appear here.
			</p>
		)}
	</DashboardPanel>
);
