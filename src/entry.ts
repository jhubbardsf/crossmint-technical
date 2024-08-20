import { config } from "@config/config";
import { MegaverseBuilder } from "@/services/builder.service";
import { GoalMap } from "@models/polyanet.model";
import { parseArgs } from "util";
import { GoalUtil } from "@utils/goal.util";

interface CLIOptions {
	destroy: boolean;
}

function parseCliArguments(): CLIOptions {
	const { values } = parseArgs({
		args: Bun.argv,
		options: {
			destroy: {
				type: "boolean",
				short: "d",
			},
		},
		strict: true,
		allowPositionals: true,
	});

	return {
		destroy: values.destroy ?? false,
	};
}

async function main() {
	const options = parseCliArguments();

	if (!config.apiUrl || !config.candidateId) {
		console.error("API URL or Candidate ID is missing in the configuration");
		return;
	}
	const builder = new MegaverseBuilder(config.apiUrl, config.candidateId);
	const goalUtil = new GoalUtil(config.apiUrl);

	try {
		const goalMap: GoalMap = await goalUtil.fetchGoalMap();
		await builder.buildMegaverse(goalMap, options);
	} catch (error) {
		console.error("Failed to build Megaverse:", error);
	}
}

await main();
