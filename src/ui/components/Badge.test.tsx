import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "@/ui/components/Badge";

const BADGE_VARIANTS = [
	["accent", "bg-highlight/10", "text-highlight", "ring-highlight/30"],
	["danger", "bg-red-400/10", "text-red-300", "ring-red-400/30"],
	["neutral", "bg-shell-elevated/80", "text-shell-muted", "ring-shell-border/80"],
	["primary", "bg-primary/10", "text-primary", "ring-primary/30"],
	["success", "bg-signal/10", "text-signal", "ring-signal/30"],
	["warning", "bg-warning/10", "text-warning", "ring-warning/35"],
] as const;

describe("Badge", () => {
	it.each(BADGE_VARIANTS)("preserves the %s visual variant", (variant, background, text, ring) => {
		render(<Badge variant={variant}>{variant}</Badge>);

		const badge = screen.getByText(variant);

		expect(badge).toHaveAttribute("data-slot", "badge");
		expect(badge).toHaveAttribute("data-variant", variant);
		expect(badge).toHaveClass(background, text, ring);
	});
});
