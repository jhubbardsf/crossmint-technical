import api from "./api";
import { config } from "@config/config";
import { HTTPError } from "ky";
import { Colors, Directions, GoalMap } from "@models/polyanet.model";

export class MegaverseBuilder {
	private baseUrl: string;
	private candidateId: string;

	constructor(baseUrl: string, candidateId: string) {
		this.baseUrl = baseUrl;
		this.candidateId = candidateId;
	}

	async buildMegaverse(goalMap: GoalMap): Promise<void> {
		const promises: Promise<void>[] = [];

		for (let row = 0; row < goalMap.length; row++) {
			for (let column = 0; column < goalMap[row].length; column++) {
				const cell = goalMap[row][column];
				if (cell !== "SPACE") {
					promises.push(this.createEntity(cell, row, column));
				}
			}
		}

		await Promise.all(promises);
		console.log("Megaverse built successfully!");
	}

	private async createEntity(
		entity: string,
		row: number,
		column: number
	): Promise<void> {
		const [type, attribute] = entity.toLowerCase().split("_");
		const params = { row, column, candidateId: this.candidateId };

		switch (type) {
			case "polyanet":
				await this.sendRequest("polyanets", params);
				break;
			case "soloon":
				await this.sendRequest("soloons", {
					...params,
					color: attribute as Colors,
				});
				break;
			case "cometh":
				await this.sendRequest("comeths", {
					...params,
					direction: attribute as Directions,
				});
				break;
			default:
				console.warn(`Unknown entity type: ${type}`);
		}
	}

	private async sendRequest(endpoint: string, params: any): Promise<void> {
		try {
			await api.post(`${this.baseUrl}/${endpoint}`, params);
		} catch (error) {
			console.error(
				`Error creating ${endpoint} at (${params.row}, ${params.column}):`,
				error
			);
			throw error;
		}
	}
}

// export class ApiService {
// 	private baseUrl: string;

// 	constructor() {
// 		this.baseUrl = config.apiUrl;
// 	}

// 	async createPolyanet(row: number, column: number): Promise<void> {
// 		try {
// 			console.log(`Creating  R${row}C${column}`);
// 			const url = `${this.baseUrl}/polyanets`;
// 			const payload = {
// 				row,
// 				column,
// 				candidateId: config.candidateId,
// 			};
// 			console.log({ url, payload });

// 			await api.post(url, {
// 				json: payload,
// 			});
// 		} catch (error) {
// 			if (error instanceof HTTPError) {
// 				console.error(
// 					`HTTP Error creating POLYanet at (${row}, ${column}):`,
// 					error.response.status,
// 					await error.response.text()
// 				);
// 			} else {
// 				console.error(`Error creating POLYanet at (${row}, ${column}):`, error);
// 			}
// 			throw error;
// 		}
// 	}
// }
