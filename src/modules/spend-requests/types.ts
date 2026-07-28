import type { z } from "zod";
import type { SPEND_REQUEST_SCHEMA, SPEND_REQUEST_STATUS_SCHEMA } from "./schemas";

export type SpendRequestStatus = z.infer<typeof SPEND_REQUEST_STATUS_SCHEMA>;

export type SpendRequest = z.infer<typeof SPEND_REQUEST_SCHEMA>;
