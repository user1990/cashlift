import { type HttpHandler, HttpResponse, http } from "msw";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";

type WorkspaceDatasetResolver = (input: {
	endDate: string | null;
	scope: string | null;
	startDate: string | null;
}) => Response;

export const createWorkspaceDatasetHandler = (resolver?: WorkspaceDatasetResolver): HttpHandler =>
	http.get("/api/v1/workspace/dataset", ({ request }) => {
		const url = new URL(request.url);

		if (resolver) {
			return resolver({
				endDate: url.searchParams.get("endDate"),
				scope: url.searchParams.get("scope"),
				startDate: url.searchParams.get("startDate"),
			});
		}

		return HttpResponse.json(financialDatasetFixture);
	});

export const DEFAULT_WORKSPACE_DATASET_API_HANDLERS = [createWorkspaceDatasetHandler()];
