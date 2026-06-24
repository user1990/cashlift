import { type ClassValue, cn as cnfast } from "cnfast";

export const cn = (...inputs: ClassValue[]) => cnfast(...inputs);
