import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "@/ui/components/Badge";

const BADGE_VARIANTS = ["accent", "danger", "neutral", "primary", "success", "warning"] as const;

describe("Badge", () => {
	it.each(BADGE_VARIANTS)("renders the %s variant content", (variant) => {
		render(<Badge variant={variant}>{variant}</Badge>);

		expect(screen.getByText(variant)).toBeInTheDocument();
	});
});
