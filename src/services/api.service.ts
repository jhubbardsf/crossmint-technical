import api from "@services/api";
import { Colors, Directions, GoalMap } from "@models/polyanet.model";

export class MegaverseBuilder {
	private baseUrl: string;
	private candidateId: string;

	constructor(baseUrl: string, candidateId: string) {
		this.baseUrl = baseUrl;
		this.candidateId = candidateId;
	}

	async buildMegaverse(goalMap: GoalMap): Promise<void> {
		for (let row = 0; row < goalMap.length; row++) {
			for (let column = 0; column < goalMap[row].length; column++) {
				const cell = goalMap[row][column];
				if (cell !== "SPACE") {
					await this.createEntity(cell, row, column);
				}
			}
		}

		console.log("Megaverse built successfully!");
	}

	private async createEntity(
		entity: string,
		row: number,
		column: number
	): Promise<void> {
		const [type, attribute] = entity.toLowerCase().split("_");
		const params = { row, column, candidateId: this.candidateId };

		console.log("Debug: ", { type, attribute, row, column });

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
			console.log("Inside sendRequest (Params): ", params);
			console.log("About to send to: ", `${this.baseUrl}/${endpoint}`);
			await api.post(`${this.baseUrl}/${endpoint}`, { json: params });
		} catch (error) {
			console.error(
				`Error creating ${endpoint} at (${params.row}, ${params.column}):`,
				error
			);
			// throw error;
		}
	}
}
