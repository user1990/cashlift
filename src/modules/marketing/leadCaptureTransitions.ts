export const LEAD_CAPTURE_TRANSITIONS = ["opacityFast", "opacitySlow", "slideFast", "slideMid", "slideSlow"] as const;

export type LeadCaptureTransitionVariant = (typeof LEAD_CAPTURE_TRANSITIONS)[number];

export const LEAD_CAPTURE_TRANSITION_KIND = {
	opacityFast: "opacity",
	opacitySlow: "opacity",
	slideFast: "slide",
	slideMid: "slide",
	slideSlow: "slide",
} as const satisfies Record<LeadCaptureTransitionVariant, "opacity" | "slide">;
