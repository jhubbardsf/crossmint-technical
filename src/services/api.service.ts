import api from "@services/api";
import { Colors, Directions, GoalMap } from "@models/polyanet.model";
type Route = "polyanets" | "soloons" | "comeths";
export class MegaverseBuilder {
	private baseUrl: string;
	private candidateId: string;

	constructor(baseUrl: string, candidateId: string) {
		this.baseUrl = baseUrl;
		this.candidateId = candidateId;
	}

	async buildMegaverse(
		goalMap: GoalMap,
		opts = { destroy: false }
	): Promise<void> {
		console.log(`${opts.destroy ? "Destroying" : "Building"} Megaverse...`);
		for (let row = 0; row < goalMap.length; row++) {
			for (let column = 0; column < goalMap[row].length; column++) {
				const cell = goalMap[row][column];
				if (cell !== "SPACE") {
					await this.createEntity(cell, row, column, opts);
				}
			}
		}

		console.log(
			`Megaverse ${opts.destroy ? "destroyed" : "built"} successfully!`
		);
	}

	private async createEntity(
		entity: string,
		row: number,
		column: number,
		opts: { destroy: boolean } = { destroy: false }
	): Promise<void> {
		const [attribute, type] = entity.toLowerCase().split("_");
		const params = { row, column, candidateId: this.candidateId };

		type PayloadBase = { row: number; column: number; candidateId: string };
		type SoloonPayload = PayloadBase & { color: Colors };
		type ComethPayload = PayloadBase & { direction: Directions };

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
				console.warn(`Unknown entity type: ${type}`);
		}

		if (route && payload) {
			await this.sendRequest(route, payload, opts.destroy);
		}
	}

	private entityToRoute(entity: string): Route | undefined {
		if (entity.includes("POLYANET")) return "polyanets";
		if (entity.includes("SOLOON")) return "soloons";
		if (entity.includes("COMETH")) return "comeths";
	}

	private async sendRequest(
		endpoint: Route,
		params: any,
		destroy: boolean
	): Promise<void> {
		const url = `${this.baseUrl}/${endpoint}`;
		const payload = { json: params };
		const fn = destroy ? api.delete : api.post;
		try {
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
