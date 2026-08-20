export const LEAD_CAPTURE_TRANSITIONS = ["slide300", "slide400"] as const;

export type LeadCaptureTransitionVariant = (typeof LEAD_CAPTURE_TRANSITIONS)[number];
