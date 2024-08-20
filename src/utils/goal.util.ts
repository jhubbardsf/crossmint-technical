import api from "@services/api";
import { config } from "@config/config";
import type { GoalMap } from "@models/types";

export class GoalUtil {
	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	/**
	 * Fetches the goal map from the API.
	 *
	 * @return {Promise<GoalMap>} A promise that resolves to the goal map.
	 */
	async fetchGoalMap(): Promise<GoalMap> {
		const route = `${this.baseUrl}/map/${config.candidateId}/goal`;

		const result = await api.get<{ goal: GoalMap }>(route);
		const { goal } = await result.json();

		return goal;
	}
}
