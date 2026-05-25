import type { z } from "zod";
import type { vendorBillSchema, vendorBillStatusSchema } from "./schemas";

export type VendorBillStatus = z.infer<typeof vendorBillStatusSchema>;

export type VendorBill = z.infer<typeof vendorBillSchema>;
