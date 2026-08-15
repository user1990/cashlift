// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/ui/components/actions/Button";

describe("Button", () => {
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
