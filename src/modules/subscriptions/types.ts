import type { z } from "zod";
import type { subscriptionSchema, subscriptionStatusSchema } from "./schemas";

export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;

export type Subscription = z.infer<typeof subscriptionSchema>;
