export const LEAD_CAPTURE_TRANSITIONS = ["slide300", "slideLeft"] as const;

export type LeadCaptureTransitionVariant = (typeof LEAD_CAPTURE_TRANSITIONS)[number];
