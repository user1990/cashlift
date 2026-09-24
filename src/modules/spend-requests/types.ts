import type { z } from "zod";
import type { SPEND_REQUEST_DECISION_SCHEMA, SPEND_REQUEST_SCHEMA, SPEND_REQUEST_STATUS_SCHEMA } from "./schemas";

export type SpendRequestStatus = z.infer<typeof SPEND_REQUEST_STATUS_SCHEMA>;

export type SpendRequestDecisionInput = z.infer<typeof SPEND_REQUEST_DECISION_SCHEMA>;

export type SpendRequestDecisionStatus = SpendRequestDecisionInput["status"];

export type SpendRequest = z.infer<typeof SPEND_REQUEST_SCHEMA>;
