import api from "@services/api";
import type { Colors, Directions } from "@models/shapes";
import type { GoalMap, TRoute } from "@models/types";

export class MegaverseBuilder {
	private baseUrl: string;
	private candidateId: string;
	private destroying: boolean;

	constructor(baseUrl: string, candidateId: string, destroying = false) {
		this.baseUrl = baseUrl;
		this.candidateId = candidateId;
		this.destroying = destroying;
	}

	async buildMegaverse(goalMap: GoalMap): Promise<void> {
		console.log(`${this.destroying ? "Destroying" : "Building"} Megaverse...`);

		for (let row = 0; row < goalMap.length; row++) {
			for (let column = 0; column < goalMap[row].length; column++) {
				const cell = goalMap[row][column];
				if (cell !== "SPACE") {
					await this.createEntity(cell, row, column);
				}
			}
		}

		console.log(
			`Megaverse ${this.destroying ? "destroyed" : "built"} successfully!`
		);
	}

	private async createEntity(
		entity: string,
		row: number,
		column: number
	): Promise<void> {
		type PayloadBase = { row: number; column: number; candidateId: string };
		type SoloonPayload = PayloadBase & { color: Colors };
		type ComethPayload = PayloadBase & { direction: Directions };

		const [attribute, type] = entity.toLowerCase().split("_");
		const params: PayloadBase = { row, column, candidateId: this.candidateId };
		const route = this.entityToRoute(entity);

		let payload: PayloadBase | SoloonPayload | ComethPayload | undefined;

		switch (route) {
			case "polyanets":
				payload = params;
				break;
			case "soloons":
				payload = { ...params, color: attribute as Colors };
				break;
			case "comeths":
				payload = { ...params, direction: attribute as Directions };
				break;
			default:
				console.warn(`Unknown route: ${route}`);
		}

		if (route && payload) {
			await this.sendRequest(route, payload);
		}
	}

	private entityToRoute(entity: string): TRoute | undefined {
		if (entity.includes("POLYANET")) return "polyanets";
		if (entity.includes("SOLOON")) return "soloons";
		if (entity.includes("COMETH")) return "comeths";
	}

	private async sendRequest(endpoint: TRoute, params: any): Promise<void> {
		const url = `${this.baseUrl}/${endpoint}`;
		const payload = { json: params };
		const fn = this.destroying ? api.delete : api.post;

		try {
			await fn(url, payload);
		} catch (error) {
			console.error(
				`Error creating ${endpoint} at (${params.row}, ${params.column}):`,
				error
			);
		}
	}
}
