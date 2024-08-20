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

	async deleteMegaverse(goalMap: GoalMap): Promise<void> {
		for (let row = 0; row < goalMap.length; row++) {
			for (let column = 0; column < goalMap[row].length; column++) {
				const cell = goalMap[row][column];
				if (cell !== "SPACE") {
					await this.deleteEntity(cell, row, column);
				}
			}
		}

		console.log("Megaverse deleted successfully!");
	}

	private async deleteEntity(
		entity: string,
		row: number,
		column: number
	): Promise<void> {
		const [type, _attribute] = entity.toLowerCase().split("_");
		const params = { row, column, candidateId: this.candidateId };

		console.log("Debug: ", { type, _attribute, row, column });

		switch (type) {
			case "polyanet":
				await this.sendRequest("polyanets", params, true);
				break;
			case "soloon":
				await this.sendRequest(
					"soloons",
					{
						...params,
						color: _attribute as Colors,
					},
					true
				);
				break;
			case "cometh":
				await this.sendRequest(
					"comeths",
					{
						...params,
						direction: _attribute as Directions,
					},
					true
				);
				break;
			default:
				console.warn(`Unknown entity type: ${type}`);
		}
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

	private async sendRequest(
		endpoint: string,
		params: any,
		destroy = false
	): Promise<void> {
		const url = `${this.baseUrl}/${endpoint}`;
		const payload = { json: params };
		const fn = destroy ? api.delete : api.post;
		try {
			console.log("Inside sendRequest (Params): ", params);
			console.log("About to send to: ", `${this.baseUrl}/${endpoint}`);
			await fn(url, payload);
		} catch (error) {
			console.error(
				`Error creating ${endpoint} at (${params.row}, ${params.column}):`,
				error
			);
			// throw error;
		}
	}
}
