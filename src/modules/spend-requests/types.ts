import type { z } from "zod";
import type { spendRequestSchema, spendRequestStatusSchema } from "./schemas";

export type SpendRequestStatus = z.infer<typeof spendRequestStatusSchema>;

export type SpendRequest = z.infer<typeof spendRequestSchema>;
