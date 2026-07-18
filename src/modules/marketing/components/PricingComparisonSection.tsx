import { Check, ChevronDown, Minus } from "lucide-react";
import { PRICING_COMPARISON_GROUPS, PRICING_PLANS } from "../content";

export const PricingComparisonSection = () => (
	<section className="scroll-mt-24 pt-4" aria-labelledby="compare-plans-heading">
		<h2 id="compare-plans-heading">
			<a
				className="mx-auto flex w-fit items-center gap-2 text-xl font-semibold text-primary outline-none transition-colors duration-150 hover:text-primary-hover focus-visible:ring-[3px] focus-visible:ring-primary/20"
				href="#comparison-table"
			>
				Compare plans in full
				<ChevronDown aria-hidden className="size-6" />
			</a>
		</h2>

		<div
			className="mt-10 max-w-full scroll-mt-24 overflow-x-auto rounded-lg border border-shell-border"
			id="comparison-table"
		>
			<table className="w-full min-w-[760px] border-collapse text-left text-m">
				<thead className="bg-shell-elevated">
					<tr>
						<th className="w-[34%] px-5 py-4 font-medium text-shell-muted">Feature</th>

						{PRICING_PLANS.map(({ name, slug }) => (
							<th className="px-5 py-4 text-l font-semibold text-shell-foreground" key={slug} scope="col">
								{name}
							</th>
						))}
					</tr>
				</thead>

				<tbody>
					{PRICING_COMPARISON_GROUPS.map((group) => (
						<ComparisonGroup group={group} key={group.name} />
					))}
				</tbody>
			</table>
		</div>
	</section>
);

type ComparisonGroupProps = {
	group: (typeof PRICING_COMPARISON_GROUPS)[number];
};

const ComparisonGroup = ({ group }: ComparisonGroupProps) => (
	<>
		<tr className="border-t border-shell-border bg-primary/5">
			<th className="px-5 py-3 text-m+ font-semibold text-primary" colSpan={4} scope="rowgroup">
				{group.name}
			</th>
		</tr>

		{group.features.map((feature) => (
			<tr className="border-t border-shell-border" key={feature.name}>
				<th className="px-5 py-3.5 font-medium text-shell-foreground" scope="row">
					{feature.name}
				</th>

				{feature.values.map((value, index) => (
					<td className="px-5 py-3.5 text-shell-muted" key={PRICING_PLANS[index]?.slug}>
						<ComparisonValue value={value} />
					</td>
				))}
			</tr>
		))}
	</>
);

const ComparisonValue = ({ value }: { value: boolean | string }) => {
	if (value === true) {
		return <Check aria-label="Included" className="size-5 text-primary" />;
	}

	if (value === false) {
		return <Minus aria-label="Not included" className="size-5 text-shell-muted" />;
	}

	return value;
};
