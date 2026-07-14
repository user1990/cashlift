import { setupServer } from "msw/node";
import { DEFAULT_SPEND_REQUEST_API_HANDLERS } from "@/modules/spend-requests/fixtures";

export const server = setupServer(...DEFAULT_SPEND_REQUEST_API_HANDLERS);
