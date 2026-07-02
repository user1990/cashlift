import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/ui/components/Button";

describe("Button", () => {
	it("calls the press handler when activated", async () => {
		const user = userEvent.setup();
		const onPress = vi.fn();

		render(
			<Button onPress={onPress} variant="primary">
				Approve spend
			</Button>,
		);

		await user.click(screen.getByRole("button", { name: "Approve spend" }));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	it("does not call the press handler when disabled", async () => {
		const user = userEvent.setup();
		const onPress = vi.fn();

		render(
			<Button disabled onPress={onPress} variant="secondary">
				Export report
			</Button>,
		);

		await user.click(screen.getByRole("button", { name: "Export report" }));

		expect(screen.getByRole("button", { name: "Export report" })).toBeDisabled();
		expect(onPress).not.toHaveBeenCalled();
	});
});
