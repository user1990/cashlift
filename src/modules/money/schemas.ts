import { z } from "zod";

export const moneyCentsSchema = z.number().int();
