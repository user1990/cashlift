// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LeakList } from "./LeakList";

describe("LeakList", () => {
	it("shows only subscriptions that qualify as leaks", () => {
		render(
			<LeakList
				items={[
					{
						amountCents: 100,
						id: "active",
						owner: "Iris",
						renewalDate: "2026-05-14",
						status: "active",
						usagePercent: 80,
						vendor: "Active tool",
					},
					{
						amountCents: 100,
						id: "unused",
						owner: "Iris",
						renewalDate: "2026-05-14",
						status: "unused",
						usagePercent: 0,
						vendor: "Unused tool",
					},
				]}
			/>,
		);

		expect(screen.queryByText("Active tool")).not.toBeInTheDocument();
		expect(screen.getByText("Unused tool")).toBeInTheDocument();
	});

	it("explains when there are no leak candidates", () => {
		render(
			<LeakList
				items={[
					{
						amountCents: 100,
						id: "active",
						owner: "Iris",
						renewalDate: "2026-05-14",
						status: "active",
						usagePercent: 80,
						vendor: "Active tool",
					},
				]}
			/>,
		);

		expect(screen.getByText("No vendor leaks need action.")).toBeInTheDocument();
		expect(screen.queryByText("Active tool")).not.toBeInTheDocument();
	});
});
