import { z } from "zod";

export const MONEY_CENTS_SCHEMA = z.number().int();
