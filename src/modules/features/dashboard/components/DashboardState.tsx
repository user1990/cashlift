import { Panel } from "@/modules/ui/components/Panel";

type DashboardStateProps = {
	message: string;
	title: string;
};

export const DashboardState = ({ message, title }: DashboardStateProps) => (
	<main className="min-h-screen bg-shell text-shell-foreground">
		<div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
			<Panel variant="accent">
				<p className="text-s+ uppercase tracking-normal text-primary">CashLift</p>

				<h1 className="mt-2 text-4xl+ tracking-normal text-panel-foreground">{title}</h1>

				<p className="mt-3 max-w-2xl text-m leading-6 text-muted-foreground">{message}</p>
			</Panel>
		</div>
	</main>
);
