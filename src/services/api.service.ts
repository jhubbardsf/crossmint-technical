import api from "./api";
import { config } from "../config/config";
import { HTTPError } from "ky";

export class ApiService {
	private baseUrl: string;

	constructor() {
		this.baseUrl = config.apiUrl;
	}

	async createPolyanet(row: number, column: number): Promise<void> {
		try {
			console.log(`Creating  R${row}C${column}`);
			const url = `${this.baseUrl}/polyanets`;
			const payload = {
				row,
				column,
				candidateId: config.candidateId,
			};
			console.log({ url, payload });

			await api.post(url, {
				json: payload,
			});
		} catch (error) {
			if (error instanceof HTTPError) {
				console.error(
					`HTTP Error creating POLYanet at (${row}, ${column}):`,
					error.response.status,
					await error.response.text()
				);
			} else {
				console.error(`Error creating POLYanet at (${row}, ${column}):`, error);
			}
			throw error;
		}
	}
}
