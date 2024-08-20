import { goal } from "./goalPhase1.json";
import { config } from "@config/config";
import { MegaverseBuilder } from "@services/api.service";
import { GoalMap } from "@models/polyanet.model";

async function main() {
	if (!config.apiUrl || !config.candidateId) {
		console.error("API URL or Candidate ID is missing in the configuration");
		return;
	}
	const builder = new MegaverseBuilder(config.apiUrl, config.candidateId);
	const goalMap: GoalMap = goal;

	try {
		await builder.buildMegaverse(goalMap);
	} catch (error) {
		console.error("Failed to build Megaverse:", error);
	}
}

main();
