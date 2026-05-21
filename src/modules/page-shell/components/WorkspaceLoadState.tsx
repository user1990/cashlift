import Link from "next/link";
import { Panel, PanelHeader } from "@/ui/components/Panel";
import { MainContent } from "./MainContent";
import type { WorkspaceSection } from "./types";
import { WorkspaceSectionHeader } from "./WorkspaceSectionHeader";

type WorkspaceLoadStateProps = {
	message: string;
	section: WorkspaceSection;
	title: string;
};

export const WorkspaceLoadState = ({ message, section, title }: WorkspaceLoadStateProps) => (
	<MainContent variant="workspace">
		<div className="mx-auto grid w-full max-w-[1440px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
			<aside className="rounded-lg border border-shell-border bg-shell-elevated p-3 shadow-shell lg:sticky lg:top-5 lg:self-start">
				<Link href="/" className="block p-2">
					<p className="text-s+ uppercase tracking-normal text-primary">CashLift</p>

					<p className="text-xl+ text-shell-foreground">Workspace</p>
				</Link>
			</aside>

			<section className="space-y-5">
				<WorkspaceSectionHeader section={section} />

				<Panel>
					<PanelHeader label="Status" title={title} />

					<p className="text-m leading-6 text-muted-foreground">{message}</p>
				</Panel>
			</section>
		</div>
	</MainContent>
);
