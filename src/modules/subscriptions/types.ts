import type { z } from "zod";
import type { SUBSCRIPTION_SCHEMA, SUBSCRIPTION_STATUS_SCHEMA } from "./schemas";

export type SubscriptionStatus = z.infer<typeof SUBSCRIPTION_STATUS_SCHEMA>;

export type Subscription = z.infer<typeof SUBSCRIPTION_SCHEMA>;
