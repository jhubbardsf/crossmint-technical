// import { goal } from "./goalPhase1.json";
import { config } from "./config/config";
import { GridUtil } from "./utils/grid.util";
import { ApiService } from "./services/api.service";
// import ky from "ky";

// const url = `https://challenge.crossmint.io/api/polyanets`;
// const payload = {
// 	row: 1,
// 	column: 1,
// 	candidateId: "465cfb47-4ee8-409a-8a95-b8f6da7ae870",
// };
// console.log({ url, payload });
// try {
// 	console.log("Attempting ky");
// 	await ky.post("https://challenge.crossmint.io/api/polyanets", {
// 		json: payload,
// 	});
// } catch (error) {
// 	console.log("Attempting fetch");
// 	throw error;
// }

async function createPolyanetCross() {
	const apiService = new ApiService();
	const gridSize = 11;
	const positions = GridUtil.generateCrossPositions(gridSize);
	console.log({ positions });

	for (const position of positions) {
		try {
			await apiService.createPolyanet(position.row, position.column);
			console.log(`Created POLYanet at (${position.row}, ${position.column})`);
		} catch (error) {
			console.error(
				`Failed to create POLYanet at (${position.row}, ${position.column})`
			);
		}
	}
}

createPolyanetCross().then(() => console.log("Cross creation completed"));
