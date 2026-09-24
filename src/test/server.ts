import { setupServer } from "msw/node";
import { DEFAULT_SPEND_REQUEST_API_HANDLERS } from "@/test/fixtures/spendRequests";

export const server = setupServer(...DEFAULT_SPEND_REQUEST_API_HANDLERS);
