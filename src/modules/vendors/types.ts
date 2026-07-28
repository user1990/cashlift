import type { z } from "zod";
import type { VENDOR_BILL_SCHEMA, VENDOR_BILL_STATUS_SCHEMA } from "./schemas";

export type VendorBillStatus = z.infer<typeof VENDOR_BILL_STATUS_SCHEMA>;

export type VendorBill = z.infer<typeof VENDOR_BILL_SCHEMA>;
