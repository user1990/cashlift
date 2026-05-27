import type { z } from "zod";
import type { invoiceSchema, invoiceStatusSchema } from "./schemas";

export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>;

export type Invoice = z.infer<typeof invoiceSchema>;
