import { PiggyBank } from "lucide-react";
import { AppButton } from "@/modules/ui/components/AppButton";

type DashboardHeaderProps = {
	name: string;
};

export const DashboardHeader = ({ name }: DashboardHeaderProps) => (
	<header className="sticky top-0 z-20 -mx-4 border-b border-[#E8E8EC]/90 bg-[#FAFAFA]/85 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
		<div className="mx-auto flex max-w-[1280px] flex-col gap-3 md:flex-row md:items-center md:justify-between">
			<div>
				<p className="text-xs font-semibold uppercase tracking-normal text-primary">
					CashLift
				</p>
				<h1 className="text-2xl font-semibold tracking-normal text-[#0A0A0A] sm:text-3xl">
					{name}&apos;s cashflow command center
				</h1>
			</div>
			<div className="flex flex-wrap items-center gap-2">
				<AppButton variant="ghost">Review leaks</AppButton>

				<AppButton variant="primary">
					<PiggyBank aria-hidden className="size-4" />
					Move cash
				</AppButton>
			</div>
		</div>
	</header>
);
