import type { ExamRequest } from "./types";
import type { DataStore } from "./data";
const CACHE_KEY: string = import.meta.env.VITE_CACHE_KEY ?? 'ifsi:request_data';
export const localStore: DataStore = {

	async saveRequest(request:ExamRequest): Promise<ExamRequest> {
		const requests = await localStore.loadRequests();
		requests.push(request);
		localStorage.setItem(CACHE_KEY, JSON.stringify(requests));
		return request;
	},
	async loadRequests(): Promise<ExamRequest[]> {
		try {
			const cached = localStorage.getItem(CACHE_KEY);
			if (cached) return JSON.parse(cached);

			const response = await fetch('/data/seed.json');
			if (!response.ok) throw new Error('Could not load requests seed data');
			return response.json();

		} catch (error) {
			return []
		}
	}
}