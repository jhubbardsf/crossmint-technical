import api from "@services/api";
import { config } from "@config/config";
import { GoalMap } from "@models/polyanet.model";

export class GoalUtil {
	/**
	 * Fetches the goal map from the API.
	 *
	 * @return {Promise<GoalMap>} A promise that resolves to the goal map.
	 */
	static async fetchGoalMap(): Promise<GoalMap> {
		const route = `/api/map/${config.candidateId}/goal`;

		const result = await api.get<GoalMap>(route);
		const map = await result.json();

		return map;
	}
}
