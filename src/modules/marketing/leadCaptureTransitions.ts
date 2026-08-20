export const LEAD_CAPTURE_TRANSITIONS = ["fade", "hold", "rise", "slow", "stagger"] as const;

export type LeadCaptureTransitionVariant = (typeof LEAD_CAPTURE_TRANSITIONS)[number];
