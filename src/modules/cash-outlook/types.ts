import type { z } from "zod";
import type { forecastPointSchema } from "./schemas";

export type ForecastPoint = z.infer<typeof forecastPointSchema>;
