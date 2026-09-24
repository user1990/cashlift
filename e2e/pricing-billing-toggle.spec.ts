import { expect, test } from "@playwright/test";

test.describe("pricing billing toggle", () => {
	test("keeps radio inputs hidden, aligned, and interactive", async ({ page }) => {
		await page.goto("/pricing?billing=annual");

		const group = page.getByRole("radiogroup", { name: "Billing interval" });
		const labels = group.locator("label");

		await expect(group.getByRole("radio", { name: "Yearly" })).toBeChecked();
		await expect(group.getByRole("radio", { name: "Monthly" })).not.toBeChecked();

		const hiddenWrappers = await labels.locator(":scope > span").evaluateAll((spans) =>
			spans.map((span) => {
				const style = getComputedStyle(span);

				return {
					clipPath: style.clipPath,
					height: style.height,
					overflow: style.overflow,
					position: style.position,
					width: style.width,
				};
			}),
		);

		expect(hiddenWrappers).toEqual([
			{ clipPath: "inset(50%)", height: "1px", overflow: "hidden", position: "absolute", width: "1px" },
			{ clipPath: "inset(50%)", height: "1px", overflow: "hidden", position: "absolute", width: "1px" },
		]);

		const groupBox = await group.boundingBox();
		const labelBoxes = await labels.evaluateAll((elements) =>
			elements.map((element) => {
				const { height, top } = element.getBoundingClientRect();

				return { center: top + height / 2 };
			}),
		);

		if (!groupBox) {
			throw new Error("Billing interval group has no layout box");
		}

		expect(labelBoxes.every(({ center }) => Math.abs(center - (groupBox.y + groupBox.height / 2)) <= 2)).toBe(true);

		await labels.nth(0).click();
		await page.keyboard.press("Tab");
		await page.keyboard.press("Shift+Tab");

		await expect(labels.nth(0)).toHaveAttribute("data-focus-visible", "true");
		const focusRing = await labels.nth(0).evaluate((label) => getComputedStyle(label).boxShadow);

		expect(focusRing).toContain("inset");

		await labels.nth(1).click();

		await expect(page).toHaveURL(/\/pricing\?billing=monthly$/);
		await expect(group.getByRole("radio", { name: "Monthly" })).toBeChecked();
		await expect(page.getByText("Billed monthly. Cancel anytime.")).toBeVisible();
	});
});
