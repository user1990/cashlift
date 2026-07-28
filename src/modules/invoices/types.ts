import type { z } from "zod";
import type { INVOICE_SCHEMA, INVOICE_STATUS_SCHEMA } from "./schemas";

export type InvoiceStatus = z.infer<typeof INVOICE_STATUS_SCHEMA>;

export type Invoice = z.infer<typeof INVOICE_SCHEMA>;
