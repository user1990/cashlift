import type { z } from "zod";
import type { FORECAST_POINT_SCHEMA } from "./schemas";

export type ForecastPoint = z.infer<typeof FORECAST_POINT_SCHEMA>;
