export const LEAD_CAPTURE_TRANSITIONS = ["opacityFast", "opacitySlow", "slideFast", "slideMid", "slideSlow"] as const;

export type LeadCaptureTransitionVariant = (typeof LEAD_CAPTURE_TRANSITIONS)[number];

type LeadCaptureTransitionKind = "opacity" | "slide";

type LeadCaptureTransitionPreset = {
	formDurationClassName: string;
	itemDelayClassNames: [string, string, string];
	itemDurationClassName: string;
	kind: LeadCaptureTransitionKind;
};

export const LEAD_CAPTURE_TRANSITION_PRESETS = {
	opacityFast: {
		formDurationClassName: "duration-75",
		itemDelayClassNames: ["delay-0", "delay-75", "delay-150"],
		itemDurationClassName: "duration-100",
		kind: "opacity",
	},
	opacitySlow: {
		formDurationClassName: "duration-150",
		itemDelayClassNames: ["delay-0", "delay-150", "delay-300"],
		itemDurationClassName: "duration-300",
		kind: "opacity",
	},
	slideFast: {
		formDurationClassName: "duration-100",
		itemDelayClassNames: ["delay-0", "delay-75", "delay-150"],
		itemDurationClassName: "duration-150",
		kind: "slide",
	},
	slideMid: {
		formDurationClassName: "duration-150",
		itemDelayClassNames: ["delay-0", "delay-100", "delay-200"],
		itemDurationClassName: "duration-200",
		kind: "slide",
	},
	slideSlow: {
		formDurationClassName: "duration-200",
		itemDelayClassNames: ["delay-75", "delay-200", "delay-500"],
		itemDurationClassName: "duration-300",
		kind: "slide",
	},
} as const satisfies Record<LeadCaptureTransitionVariant, LeadCaptureTransitionPreset>;
