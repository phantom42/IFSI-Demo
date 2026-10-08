import { localStore } from "./store-local";
import type { ExamRequest } from "./types";

export interface DataStore{
	loadRequests(): Promise<ExamRequest[]>;
	saveRequest(request: ExamRequest): Promise<ExamRequest>;
}

// original plan was to do dual builds for local storage and remote api
export const store: DataStore = localStore ;