import type { Dispatch, SetStateAction } from "react";
import type { CompanyRole } from "@/modules/base/finance/types";
import { Panel } from "@/modules/ui/components/Panel";
import { Reveal } from "@/modules/ui/components/Reveal";
import { SegmentedControl } from "@/modules/ui/components/SegmentedControl";
import { roleOptions } from "../constants";
import { SpendRequestPanel } from "./SpendRequestPanel";

type DashboardHeroSectionProps = {
	role: CompanyRole;
	setRole: Dispatch<SetStateAction<CompanyRole>>;
};

export const DashboardHeroSection = ({ role, setRole }: DashboardHeroSectionProps) => (
	<Reveal className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]" duration={0.18} y={8}>
		<Panel variant="accent">
			<div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
				<div>
					<p className="text-s+ uppercase tracking-normal text-primary">Today&apos;s CashLift</p>

					<h1 className="mt-2 max-w-2xl text-4xl+ tracking-normal text-panel-foreground sm:text-5xl+">
						Approve spend with cash impact before money leaves.
					</h1>

					<p className="mt-3 max-w-2xl text-m leading-6 text-muted-foreground">
						CashLift turns invoices, bills, subscriptions, budgets, and spend requests into one action inbox for service
						teams.
					</p>
				</div>

				<div className="min-w-60 rounded-lg border border-primary-subtle-border bg-panel p-3">
					<p className="text-s font-medium text-muted-foreground">View app as</p>

					<SegmentedControl label="Dashboard role" onChange={setRole} options={roleOptions} value={role} />
				</div>
			</div>
		</Panel>

		<SpendRequestPanel />
	</Reveal>
);
